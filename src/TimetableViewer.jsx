import { useEffect, useRef, useState } from "react";
import { deleteTimetable, getTimetable, saveTimetable } from "./timetableStorage";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

export default function TimetableViewer({ userId, semesterId, semesterLabel, lang, onClose }) {
  const fileInput = useRef(null);
  const [record, setRecord] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [error, setError] = useState("");
  const zh = lang === "zh";

  useEffect(() => {
    let active = true;
    getTimetable(userId, semesterId)
      .then(saved => { if (active) setRecord(saved || null); })
      .catch(() => { if (active) setError(zh ? "无法读取本机保存的课程表。" : "Could not read the timetable saved on this device."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [userId, semesterId, zh]);

  useEffect(() => {
    if (!record?.image) return undefined;
    const url = URL.createObjectURL(record.image);
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [record]);

  async function handleFile(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setError("");
    if (!IMAGE_TYPES.includes(file.type)) {
      setError(zh ? "请选择 PNG、JPG 或 WebP 图片。" : "Choose a PNG, JPG, or WebP image.");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setError(zh ? "图片不能超过 10 MB。" : "The image must be 10 MB or smaller.");
      return;
    }
    setBusy(true);
    try {
      await saveTimetable(userId, semesterId, file);
      setRecord({ image: file, name: file.name, updatedAt: Date.now() });
      setZoomed(false);
    } catch {
      setError(zh ? "保存失败，请检查浏览器可用空间后重试。" : "Could not save the image. Check your browser storage and try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    setBusy(true);
    setError("");
    try {
      await deleteTimetable(userId, semesterId);
      setRecord(null);
      setImageUrl("");
    } catch {
      setError(zh ? "删除失败，请重试。" : "Could not remove the image. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="calendar-overlay" onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="calendar-modal timetable-modal" role="dialog" aria-modal="true" aria-label={zh ? "课程表" : "Timetable"}>
        <div className="calendar-modal-header timetable-modal-header">
          <div>
            <div className="calendar-modal-title">{zh ? "课程表" : "Timetable"} · {semesterLabel}</div>
            <div className="timetable-storage-note">{zh ? "图片保存在当前浏览器，按账号和学期区分" : "Saved in this browser for this account and semester"}</div>
          </div>
          <div className="calendar-modal-actions">
            <input ref={fileInput} className="timetable-file-input" type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFile} />
            <button className="calendar-download" disabled={busy || loading} onClick={() => fileInput.current?.click()}>
              {record ? (zh ? "更换图片" : "Replace image") : (zh ? "上传图片" : "Upload image")}
            </button>
            {record && <>
              <button className="calendar-year" onClick={() => setZoomed(value => !value)}>
                {zoomed ? (zh ? "适应窗口" : "Fit window") : (zh ? "查看原图" : "Actual size")}
              </button>
              <button className="calendar-year timetable-delete" disabled={busy} onClick={handleDelete}>{zh ? "删除" : "Remove"}</button>
            </>}
            <button className="calendar-close" onClick={onClose} aria-label={zh ? "关闭课程表" : "Close timetable"}>×</button>
          </div>
        </div>
        {error && <div className="timetable-error" role="alert">{error}</div>}
        <div className="calendar-image-wrap timetable-image-wrap">
          {loading ? <div className="timetable-empty">{zh ? "正在读取课程表…" : "Loading timetable…"}</div> :
            imageUrl && record ?
              <img src={imageUrl} alt={zh ? `${semesterLabel} 课程表` : `${semesterLabel} timetable`} className={`calendar-image ${zoomed ? "timetable-image-original" : ""}`} /> :
              <div className="timetable-empty">
                <div className="timetable-empty-icon">▦</div>
                <strong>{zh ? "还没有课程表图片" : "No timetable image yet"}</strong>
                <span>{zh ? "上传一张课程表截图，之后就能从这里快速查看。" : "Upload a screenshot to view it here anytime."}</span>
                <button className="calendar-download" disabled={busy} onClick={() => fileInput.current?.click()}>{zh ? "选择图片" : "Choose image"}</button>
              </div>}
        </div>
      </div>
    </div>
  );
}

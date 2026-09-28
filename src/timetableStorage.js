const DB_NAME = "xmum-reference-images";
const STORE_NAME = "timetables";

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error("Database is blocked"));
  });
}

async function runRequest(mode, key, value) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, mode);
    const store = transaction.objectStore(STORE_NAME);
    let result;
    const request = mode === "readonly"
      ? store.get(key)
      : value === undefined
        ? store.delete(key)
        : store.put(value, key);

    request.onsuccess = () => { result = request.result; };
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => { db.close(); resolve(result); };
    transaction.onabort = () => { db.close(); reject(transaction.error); };
    transaction.onerror = () => { db.close(); reject(transaction.error); };
  });
}

function timetableKey(userId, semesterId) {
  return `${userId}:${semesterId}`;
}

export function getTimetable(userId, semesterId) {
  return runRequest("readonly", timetableKey(userId, semesterId));
}

export function saveTimetable(userId, semesterId, file) {
  return runRequest("readwrite", timetableKey(userId, semesterId), {
    image: file,
    name: file.name,
    updatedAt: Date.now(),
  });
}

export function deleteTimetable(userId, semesterId) {
  return runRequest("readwrite", timetableKey(userId, semesterId));
}

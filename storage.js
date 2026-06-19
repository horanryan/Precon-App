'use strict';

const DB_NAME = 'absolute-precon-offline-v2';
const DB_VERSION = 1;
let dbPromise;
/* Open IndexedDB and create the job and photo stores on first use. */
async function initDb() {
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = event => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('jobs')) db.createObjectStore('jobs', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('photos')) db.createObjectStore('photos', { keyPath: 'id' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  await dbPromise;
}

/* Small helper wrapper for IndexedDB transactions */
async function txStore(storeName, mode, callback) {
  const db = await dbPromise;
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    let result;
    tx.oncomplete = () => resolve(result);
    tx.onabort = tx.onerror = () => reject(tx.error || new Error(`IndexedDB transaction failed for ${storeName}`));

    try {
      result = callback(store);
    } catch (err) {
      tx.abort();
      reject(err);
    }
  });
}

/* Insert or replace one record in a named store. */
async function putStore(storeName, value) { return txStore(storeName, 'readwrite', store => store.put(value)); }

/* Delete one record by primary key from a named store. */
async function deleteStore(storeName, id) { return txStore(storeName, 'readwrite', store => store.delete(id)); }

/* Read every record from a named store. */
async function getAll(storeName) {
  const db = await dbPromise;
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const req = tx.objectStore(storeName).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}
/* Retrieve one saved job, returning null when it no longer exists. */
async function getJob(id) {
  const db = await dbPromise;
  return new Promise((resolve, reject) => {
    const tx = db.transaction('jobs', 'readonly');
    const req = tx.objectStore('jobs').get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

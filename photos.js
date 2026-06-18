'use strict';

const photoUrls = new Map();
async function getCurrentPhotos() {
  const all = await getAll('photos');
  return all.filter(photo => photo.jobId === currentJob.id).sort((a, b) => (a.sortKey || 0) - (b.sortKey || 0));
}

/* Add selected image files to the current job, converting them to resized JPEGs */
async function addPhotoFiles(files) {
  if (!files.length) return;
  await saveCurrentDraft();
  setStatus(`Processing ${files.length} photo(s)...`);

  const existing = await getCurrentPhotos();
  let sortKey = existing.length ? Math.max(...existing.map(p => p.sortKey || 0)) + 1 : 1;
  let added = 0;
  let failed = 0;

  for (const file of files) {
    if (!isImageFile(file)) {
      failed++;
      continue;
    }

    try {
      const blob = await resizeToJpegBlob(file, 1800, 0.78);
      const dataUrl = await blobToDataUrl(blob);
      await putStore('photos', {
        id: createId('photo'),
        jobId: currentJob.id,
        sortKey: sortKey++,
        name: file.name || 'photo.jpg',
        caption: '',
        type: 'image/jpeg',
        size: blob.size,
        createdAt: new Date().toISOString(),
        dataUrl
      });
      added++;
    } catch (err) {
      console.warn('Photo import failed', file.name || file.type || 'unknown file', err);
      failed++;
    }
  }

  await renderPhotos();
  await updateStorageStatus();

  if (added && failed) setStatus(`Added ${added} photo(s). ${failed} file(s) could not be imported.`);
  else if (added) setStatus(`Added ${added} photo(s).`);
  else setStatus('No photos were added. Try selecting JPEG or PNG images from the photo library.');
}

/* Render photo cards and wire photo controls */
async function renderPhotos() {
  for (const url of photoUrls.values()) URL.revokeObjectURL(url);
  photoUrls.clear();

  const photos = await getCurrentPhotos();
  els.photoGrid.innerHTML = '';
  if (!photos.length) {
    els.photoGrid.innerHTML = '<p class="muted small">No photos added yet.</p>';
    return;
  }

  const template = document.getElementById('photoCardTemplate');
  photos.forEach((photo, index) => {
    const node = template.content.firstElementChild.cloneNode(true);
    const img = node.querySelector('img');

    if (photo.dataUrl) {
      img.src = photo.dataUrl;
    } else if (photo.blob) {
      const url = URL.createObjectURL(photo.blob);
      photoUrls.set(photo.id, url);
      img.src = url;
    }

    img.alt = photo.caption || photo.name || 'Job photo';
    const caption = node.querySelector('textarea');
    caption.value = photo.caption || '';
    caption.addEventListener('input', debounce(async () => {
      try {
        photo.caption = caption.value.trim();
        await putStore('photos', photo);
      } catch (err) {
        console.error('Photo caption save failed', err);
        setStatus(`Could not save photo caption: ${err.message || 'unknown error'}`);
      }
    }, 250));

    node.querySelector('.remove-photo').addEventListener('click', async () => {
      if (!confirm('Remove this photo?')) return;
      try {
        await deleteStore('photos', photo.id);
        await renderPhotos();
        await updateStorageStatus();
      } catch (err) {
        console.error('Photo removal failed', err);
        setStatus(`Could not remove photo: ${err.message || 'unknown error'}`);
      }
    });

    node.querySelector('.move-up').disabled = index === 0;
    node.querySelector('.move-down').disabled = index === photos.length - 1;
    node.querySelector('.move-up').addEventListener('click', () => swapPhotoSort(photo, photos[index - 1]));
    node.querySelector('.move-down').addEventListener('click', () => swapPhotoSort(photo, photos[index + 1]));
    els.photoGrid.appendChild(node);
  });
}

/* Swap sort order of two photos and persist the change */
async function swapPhotoSort(a, b) {
  const tmp = a.sortKey;
  a.sortKey = b.sortKey;
  b.sortKey = tmp;
  await putStore('photos', a);
  await putStore('photos', b);
  await renderPhotos();
}

/* Display approximate device storage usage if available */
async function updateStorageStatus() {
  if (!navigator.storage?.estimate) {
    els.storageStatus.textContent = 'Photos are saved locally on this device.';
    return;
  }

  const est = await navigator.storage.estimate();
  els.storageStatus.textContent = `Device app storage used: ${formatBytes(est.usage || 0)}${est.quota ? ` of about ${formatBytes(est.quota)}` : ''}. Photos are limited by device/browser storage.`;
}
function isImageFile(file) {
  if (file.type && file.type.startsWith('image/')) return true;
  return /\.(jpe?g|png|gif|webp|heic|heif)$/i.test(file.name || '');
}

async function resizeToJpegBlob(fileOrBlob, maxDim = 1800, quality = 0.78) {
  const url = URL.createObjectURL(fileOrBlob);

  try {
    const img = await loadImage(url);

    const sourceWidth = img.naturalWidth || img.width;
    const sourceHeight = img.naturalHeight || img.height;

    if (!sourceWidth || !sourceHeight) {
      throw new Error('Photo loaded but dimensions could not be read.');
    }

    const size = scaleDimensions(sourceWidth, sourceHeight, maxDim);
    const canvas = document.createElement('canvas');
    canvas.width = size.width;
    canvas.height = size.height;

    const ctx = canvas.getContext('2d', { alpha: false });
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    return await canvasToJpegBlob(canvas, quality);
  } finally {
    URL.revokeObjectURL(url);
  }
}

/* Create a JPEG image object from a blob for PDF rendering */
async function blobToJpegImage(blob, maxDim, quality) {
  return dataUrlToJpegImage(await blobToDataUrl(await resizeToJpegBlob(blob, maxDim, quality)), maxDim, quality);
}

/* Convert stored photo data into a usable data URL string */
async function photoToDataUrl(photo) {
  if (photo.dataUrl) return photo.dataUrl;
  if (photo.blob) return blobToDataUrl(photo.blob);
  throw new Error('Photo data is missing');
}

/* Convert a stored photo record into a JPEG image object for PDF output */
async function photoToJpegImage(photo, maxDim, quality) {
  if (photo.dataUrl) return dataUrlToJpegImage(photo.dataUrl, maxDim, quality);
  if (photo.blob) return blobToJpegImage(photo.blob, maxDim, quality);
  throw new Error('Photo data is missing');
}

/* Load a data URL and produce a JPEG image object with dimensions */
async function dataUrlToJpegImage(dataUrl, maxDim = 1600, quality = 0.82) {
  const img = await loadImage(dataUrl);
  const size = scaleDimensions(img.naturalWidth, img.naturalHeight, maxDim);
  const canvas = document.createElement('canvas');
  canvas.width = size.width;
  canvas.height = size.height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const out = canvas.toDataURL('image/jpeg', quality);
  return { bytes: dataUrlToBytes(out), width: size.width, height: size.height };
}

/* Convert a canvas into a JPEG blob asynchronously */
function canvasToJpegBlob(canvas, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('Photo could not be converted to JPEG'));
    }, 'image/jpeg', quality);
  });
}
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = async () => {
      try {
        if (img.decode) await img.decode().catch(() => {});
      } catch (_) {}
      resolve(img);
    };

    img.onerror = () => reject(new Error('Image could not be loaded. On iPad this is usually an HEIC/photo-library decoding issue. Try selecting JPEG/PNG or taking the photo from the camera option.'));
    img.src = src;
  });
}

/* Convert a Blob into a Data URL for use by the image loader */
function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

/* Convert a Data URL encoding into raw bytes */
function dataUrlToBytes(dataUrl) {
  const bin = atob(dataUrl.split(',')[1]);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

/* Scale dimensions proportionally so the larger side fits within maxDim */
function scaleDimensions(width, height, maxDim) {
  const scale = Math.min(1, maxDim / Math.max(width, height));
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) };
}

/* Fit a rectangle into a bounding box while preserving aspect ratio */
function fitRect(w, h, maxW, maxH) {
  const scale = Math.min(maxW / w, maxH / h, 1);
  return { w: w * scale, h: h * scale };
}

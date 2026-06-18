'use strict';

let signatureDrawing = false;
let signatureHasInk = false;
let signatureImageData = '';
let signatureTypedName = '';
function bindSignaturePad() {
  resizeSignatureCanvas();
  window.addEventListener('resize', resizeSignatureCanvas);

  els.signatureCanvas.addEventListener('pointerdown', event => {
    event.preventDefault();
    if (signatureTypedName) {
      signatureTypedName = '';
      signatureHasInk = false;
      signatureImageData = '';
      els.typedSignatureName.value = '';
      clearSignatureCanvas();
      updateSignatureStatus();
    }
    signatureDrawing = true;
    els.signatureCanvas.setPointerCapture?.(event.pointerId);
    const point = signaturePoint(event);
    const ctx = signatureContext();
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
  });

  els.signatureCanvas.addEventListener('pointermove', event => {
    if (!signatureDrawing) return;
    event.preventDefault();
    const point = signaturePoint(event);
    const ctx = signatureContext();
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    signatureHasInk = true;
    signatureTypedName = '';
    els.typedSignatureName.value = '';
    updateSignatureStatus();
  });

  ['pointerup', 'pointercancel', 'pointerleave'].forEach(type => {
    els.signatureCanvas.addEventListener(type, event => {
      if (!signatureDrawing) return;
      signatureDrawing = false;
      if (els.signatureCanvas.hasPointerCapture?.(event.pointerId)) {
        els.signatureCanvas.releasePointerCapture(event.pointerId);
      }
      if (signatureHasInk) {
        signatureImageData = els.signatureCanvas.toDataURL('image/png');
        markDirty(true);
      }
      updateSignatureStatus();
    });
  });

  els.useTypedSignatureBtn.addEventListener('click', () => {
    const name = els.typedSignatureName.value.trim() || document.getElementById('field_customerName')?.value.trim() || '';
    if (!name) {
      setStatus('Enter a typed signature name first.');
      els.typedSignatureName.focus();
      return;
    }

    els.typedSignatureName.value = name;
    renderTypedSignature(name);
    signatureTypedName = name;
    signatureHasInk = true;
    signatureImageData = els.signatureCanvas.toDataURL('image/png');
    updateSignatureStatus();
    markDirty(true);
  });

  els.typedSignatureName.addEventListener('input', () => {
    if (signatureTypedName) {
      signatureTypedName = '';
      signatureHasInk = false;
      signatureImageData = '';
      clearSignatureCanvas();
      updateSignatureStatus();
    }
  });

  els.clearSignatureBtn.addEventListener('click', () => {
    signatureHasInk = false;
    signatureImageData = '';
    signatureTypedName = '';
    els.typedSignatureName.value = '';
    clearSignatureCanvas();
    updateSignatureStatus();
    markDirty(true);
  });
}

function resizeSignatureCanvas() {
  const canvas = els.signatureCanvas;
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(320, Math.round(rect.width || 0));
  const height = Math.max(190, Math.round(rect.height || 0));
  const ratio = window.devicePixelRatio || 1;

  if (canvas.width !== Math.round(width * ratio) || canvas.height !== Math.round(height * ratio)) {
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
  }

  const ctx = signatureContext();
  ctx.clearRect(0, 0, width, height);
  if (signatureImageData) drawSignatureImage(signatureImageData);
}

function signatureContext() {
  const canvas = els.signatureCanvas;
  const ratio = window.devicePixelRatio || 1;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.lineWidth = 2.4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = '#201727';
  return ctx;
}

function signaturePoint(event) {
  const rect = els.signatureCanvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}

function clearSignatureCanvas() {
  const canvas = els.signatureCanvas;
  const rect = canvas.getBoundingClientRect();
  signatureContext().clearRect(0, 0, rect.width, rect.height);
}

function renderTypedSignature(name) {
  clearSignatureCanvas();
  const canvas = els.signatureCanvas;
  const rect = canvas.getBoundingClientRect();
  const ctx = signatureContext();
  const maxWidth = Math.max(120, rect.width - 42);
  let fontSize = Math.min(58, Math.max(34, rect.width / 9));

  do {
    ctx.font = `${fontSize}px "Segoe Script", "Brush Script MT", "Lucida Handwriting", cursive`;
    fontSize -= 2;
  } while (ctx.measureText(name).width > maxWidth && fontSize > 24);

  ctx.fillStyle = '#201727';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(name, rect.width / 2, rect.height / 2 + 8, maxWidth);
}

async function drawSignatureImage(dataUrl) {
  try {
    const img = await loadImage(dataUrl);
    const canvas = els.signatureCanvas;
    const rect = canvas.getBoundingClientRect();
    const ctx = signatureContext();
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.drawImage(img, 0, 0, rect.width, rect.height);
  } catch (err) {
    console.warn('Saved signature could not be drawn', err);
  }
}

function updateSignatureStatus() {
  if (signatureTypedName) {
    els.signatureStatus.textContent = 'Typed signature will be embedded in the PDF.';
  } else if (signatureHasInk) {
    els.signatureStatus.textContent = 'Captured signature will be embedded in the PDF.';
  } else {
    els.signatureStatus.textContent = 'No captured signature. PDF will include a signature field.';
  }
}
function collectSignatureFields(job) {
  if (signatureHasInk && signatureImageData) {
    job.signatureMode = signatureTypedName ? 'typed' : 'captured';
    job.signatureName = signatureTypedName || job.fields?.customerName || '';
    job.signatureDate = job.signatureDate || new Date().toISOString().slice(0, 10);
    job.signatureImage = signatureImageData;
    job.signatureTypedName = signatureTypedName || '';
    delete job.remote;
    return;
  }

  job.signatureDate = '';
  delete job.signatureMode;
  delete job.signatureName;
  delete job.signatureImage;
  delete job.signatureTypedName;
  delete job.remote;
}

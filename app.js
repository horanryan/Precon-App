'use strict';

/*
  App constants and store definitions
*/

/* Standard selections used in multiple checklist items */

const REQUIRED_ELEMENT_IDS = [
  'installBtn', 'newJobBtn', 'saveBtn', 'jobList', 'storageStatus', 'currentJobTitle', 'dirtyPill',
  'documentTypeSelect', 'jobInfoFields', 'inspectionSectionTitle', 'inspectionItems', 'inHouseSectionTitle', 'inHouseItems',
  'extraDocumentSections', 'summaryNotes', 'addPhotosBtn', 'photoInput', 'photoGrid',
  'refreshPhotosBtn', 'clearPhotosBtn', 'signedPdfBtn', 'outputStatus',
  'typedSignatureName', 'useTypedSignatureBtn', 'signatureCanvas', 'clearSignatureBtn', 'signatureStatus',
  'bottomSaveBtn', 'bottomSignedPdfBtn', 'bottomOutputStatus',
  'checklistForm'
];

let currentJob = blankJob();
let deferredInstallPrompt = null;
const els = {};

/* Initialize app when DOM is ready */
window.addEventListener('DOMContentLoaded', async () => {
  try {
    cacheEls();
    populateDocumentTypeSelect();
    renderFormShell();
    bindEvents();
    await initDb();
    hydrateForm(normalizeJob(currentJob));
    await loadDraftList();
    await renderPhotos();
    await updateStorageStatus();
    registerServiceWorker();
  } catch (err) {
    console.error('App initialization failed', err);
    setStatus(`App could not start: ${err.message || 'unknown error'}`);
  }
});

/* Cache references to DOM elements for faster access */
function cacheEls() {
  REQUIRED_ELEMENT_IDS.forEach(id => {
    const el = document.getElementById(id);
    if (!el) throw new Error(`Missing required element #${id}`);
    els[id] = el;
  });
}

/* Create a new blank job object with standard metadata */
function blankJob() {
  const today = new Date().toISOString().slice(0, 10);
  return {
    id: createId('job'),
    documentType: DEFAULT_DOCUMENT_TYPE,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fields: {},
    items: {},
    inHouse: {},
    summaryNotes: '',
    signatureDate: today
  };
}


function getDocumentDefinition(type) {
  return DOCUMENT_TYPES[type] || DOCUMENT_TYPES[DEFAULT_DOCUMENT_TYPE];
}

function activeDocument() {
  return getDocumentDefinition(currentJob?.documentType);
}

function normalizeJob(job) {
  const out = job || blankJob();
  out.documentType = getDocumentDefinition(out.documentType).id;
  out.fields = out.fields || {};
  out.items = out.items || {};
  out.inHouse = out.inHouse || {};
  out.gutters = out.gutters || {};
  out.pergolaPan6 = out.pergolaPan6 || {};
  out.general = out.general || {};
  out.summaryNotes = out.summaryNotes || '';
  return out;
}

function populateDocumentTypeSelect() {
  els.documentTypeSelect.innerHTML = Object.values(DOCUMENT_TYPES)
    .map(doc => `<option value="${doc.id}">${escapeHtml(doc.label)}</option>`)
    .join('');
}

/* Build the form UI from the checklist definitions */
function renderFormShell() {
  const doc = activeDocument();
  els.documentTypeSelect.value = doc.id;
  els.inspectionSectionTitle.textContent = doc.groups[0]?.title || 'Document Items';
  els.inHouseSectionTitle.textContent = doc.groups[1]?.title || 'Additional Items';
  els.summaryNotes.placeholder = doc.summaryPlaceholder || 'Enter summary notes...';
  els.jobInfoFields.innerHTML = doc.fields.map(field => `
    <label class="field ${field.id === 'address' ? 'full-field' : ''}">
      <span>${escapeHtml(field.label)}</span>
      <input id="field_${field.id}" data-kind="job-field" data-id="${field.id}" type="${field.type || 'text'}">
    </label>
  `).join('');
  els.inspectionItems.innerHTML = (doc.groups[0]?.items || []).map(item => renderChecklistItem(item, doc.groups[0].key)).join('');
  els.inHouseItems.innerHTML = (doc.groups[1]?.items || []).map(item => renderChecklistItem(item, doc.groups[1].key)).join('');
  els.extraDocumentSections.innerHTML = doc.groups.slice(2).map(group => `
    <section class="card">
      <h2>${escapeHtml(group.title)}</h2>
      <div>${group.items.map(item => renderChecklistItem(item, group.key)).join('')}</div>
    </section>
  `).join('');
}

/* Render a single checklist item card */
function renderChecklistItem(item, kind) {
  const control = item.options ? renderSelectControl(item, kind) : renderTextControl(item, kind);
  const wording = renderDisplayedWording(item);
  return `
    <div class="item-card" data-kind="${kind}" data-item-id="${item.id}">
      <div class="item-title">${escapeHtml(item.label)}</div>
      <div class="item-control">
        ${control}
        ${wording}
      </div>
    </div>
  `;
}

/* Render a dropdown for option-based checklist items */
function renderSelectControl(item, kind) {
  return `
    <label class="field">
      <span>Selection</span>
      <select data-kind="${kind}" data-id="${item.id}" data-prop="selection">
        ${item.options.map(opt => `<option value="${escapeHtml(opt)}">${escapeHtml(opt || 'Select...')}</option>`).join('')}
      </select>
    </label>
  `;
}

/* Render a free-form text area for value-based checklist items */
function renderTextControl(item, kind) {
  return `
    <label class="field full-field">
      <span>Value</span>
      <textarea rows="2" data-kind="${kind}" data-id="${item.id}" data-prop="value" placeholder="Enter value..."></textarea>
    </label>
  `;
}

/* Render optional wording guidance for checklist item selections */
function renderDisplayedWording(item) {
  const rows = activeDocument().displayedWording?.[item.id];
  if (!rows || !rows.length) return '';
  return `
    <div class="displayed-wording">
      <div class="displayed-wording-title">Displayed wording for selections:</div>
      ${rows.map(([selection, wording]) => `
        <div class="displayed-wording-row">
          <strong>${escapeHtml(selection)}:</strong>
          <span>${escapeHtml(wording)}</span>
        </div>
      `).join('')}
    </div>
  `;
}

/* Wire UI controls for form behavior, saving, and photo handling */
function bindEvents() {
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredInstallPrompt = event;
    els.installBtn.classList.remove('hidden');
  });

  els.installBtn.addEventListener('click', async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    els.installBtn.classList.add('hidden');
  });

  els.newJobBtn.addEventListener('click', async () => {
    if (isDirty() && !confirm('Start a new document? Unsaved changes will be lost.')) return;
    currentJob = blankJob();
    currentJob.documentType = els.documentTypeSelect.value || DEFAULT_DOCUMENT_TYPE;
    hydrateForm(currentJob);
    await renderPhotos();
    markDirty(false);
  });

  els.documentTypeSelect.addEventListener('change', async () => {
    const nextType = els.documentTypeSelect.value || DEFAULT_DOCUMENT_TYPE;
    if (nextType === currentJob.documentType) return;
    if (isDirty() && !confirm('Switch document type? Unsaved changes in this draft will be lost.')) {
      els.documentTypeSelect.value = currentJob.documentType;
      return;
    }

    const previous = collectJobFromForm(currentJob.documentType);
    const nextJob = blankJob();
    nextJob.documentType = nextType;
    ['customerName', 'address', 'email', 'phone', 'jobNumberPhase'].forEach(id => {
      if (previous.fields?.[id]) nextJob.fields[id] = previous.fields[id];
    });
    currentJob = nextJob;
    renderFormShell();
    hydrateForm(currentJob);
    await renderPhotos();
    markDirty(true);
  });

  bindAsyncClick(els.saveBtn, saveCurrentDraft, 'Save failed');
  els.checklistForm.addEventListener('input', () => markDirty(true));
  els.checklistForm.addEventListener('change', () => markDirty(true));

  els.addPhotosBtn.addEventListener('click', () => {
    els.photoInput.value = '';
    els.photoInput.click();
  });

  els.photoInput.addEventListener('change', async event => {
    const files = Array.from(event.target.files || []);
    try {
      setStatus(files.length ? `Selected ${files.length} photo(s). Importing...` : 'No photos selected.');
      await addPhotoFiles(files);
    } catch (err) {
      console.error('Photo selection failed', err);
      setStatus(`Photo import failed: ${err.message || 'unknown error'}`);
    } finally {
      event.target.value = '';
    }
  });

  bindAsyncClick(els.refreshPhotosBtn, renderPhotos, 'Photo refresh failed');
  els.clearPhotosBtn.addEventListener('click', async () => {
    if (!confirm('Remove every photo from this draft?')) return;
    try {
      const photos = await getCurrentPhotos();
      for (const photo of photos) await deleteStore('photos', photo.id);
      await renderPhotos();
      await updateStorageStatus();
      markDirty(true);
    } catch (err) {
      console.error('Photo clearing failed', err);
      setStatus(`Could not clear photos: ${err.message || 'unknown error'}`);
    }
  });

  bindSignaturePad();
  els.signedPdfBtn.addEventListener('click', generatePacket);
  bindAsyncClick(els.bottomSaveBtn, saveCurrentDraft, 'Save failed');
  els.bottomSignedPdfBtn.addEventListener('click', generatePacket);
}

function bindAsyncClick(el, action, label) {
  el.addEventListener('click', async () => {
    try {
      await action();
    } catch (err) {
      console.error(label, err);
      setStatus(`${label}: ${err.message || 'unknown error'}`);
    }
  });
}


/* Track unsaved changes and update status indicators */
function isDirty() { return els.dirtyPill && !els.dirtyPill.classList.contains('saved'); }
function markDirty(dirty) {
  els.dirtyPill.textContent = dirty ? 'Unsaved' : 'Saved';
  els.dirtyPill.classList.toggle('saved', !dirty);
}
function setStatus(message) {
  const text = message || '';
  if (els.outputStatus) els.outputStatus.textContent = text;
  if (els.bottomOutputStatus) els.bottomOutputStatus.textContent = text;
}

/* Build the job object from current form values */
function collectJobFromForm(documentTypeOverride = null) {
  const job = normalizeJob(currentJob || blankJob());
  const doc = getDocumentDefinition(documentTypeOverride || els.documentTypeSelect.value || job.documentType);
  job.documentType = doc.id;
  job.updatedAt = new Date().toISOString();
  job.fields = {};
  doc.fields.forEach(field => {
    job.fields[field.id] = document.getElementById(`field_${field.id}`)?.value.trim() || '';
  });
  doc.groups.forEach(group => {
    job[group.key] = collectItemGroup(group.key, group.items);
  });
  job.summaryNotes = els.summaryNotes.value.trim();

  collectSignatureFields(job);

  return job;
}


/* Collect item group values from the rendered checklist fields */
function collectItemGroup(kind, list) {
  const out = {};
  list.forEach(item => {
    const el = getItemControl(kind, item);
    if (item.options) {
      out[item.id] = { selection: el?.value || '' };
    } else {
      out[item.id] = { value: el?.value.trim() || '' };
    }
  });
  return out;
}

/* Render a saved job record back into the form */
function hydrateForm(job) {
  currentJob = normalizeJob(job);
  renderFormShell();
  const doc = activeDocument();
  els.documentTypeSelect.value = doc.id;
  doc.fields.forEach(field => {
    const el = document.getElementById(`field_${field.id}`);
    if (el) el.value = currentJob.fields?.[field.id] || '';
  });
  doc.groups.forEach(group => hydrateItemGroup(group.key, group.items, currentJob[group.key] || {}));
  els.summaryNotes.value = currentJob.summaryNotes || '';
  signatureImageData = currentJob.signatureImage || '';
  signatureTypedName = currentJob.signatureMode === 'typed' ? (currentJob.signatureTypedName || currentJob.signatureName || '') : '';
  els.typedSignatureName.value = signatureTypedName;
  signatureHasInk = Boolean(signatureImageData);
  resizeSignatureCanvas();
  updateSignatureStatus();
  els.currentJobTitle.textContent = draftTitle(currentJob, 'New Document');
  markDirty(false);
}

function hydrateItemGroup(kind, list, data) {
  list.forEach(item => {
    const row = data[item.id] || {};
    const el = getItemControl(kind, item);
    if (!el) return;
    if (item.options) {
      el.value = item.options.includes(row.selection) ? row.selection : '';
    } else {
      el.value = row.value || '';
    }
  });
}

function getItemControl(kind, item) {
  const prop = item.options ? 'selection' : 'value';
  return document.querySelector(`[data-kind="${kind}"][data-id="${item.id}"][data-prop="${prop}"]`);
}

/* Save current draft to IndexedDB and refresh UI state */
async function saveCurrentDraft() {
  currentJob = collectJobFromForm();
  await putStore('jobs', currentJob);
  await loadDraftList();
  await updateStorageStatus();
  hydrateForm(currentJob);
  setStatus(`Saved draft at ${new Date().toLocaleTimeString()}.`);
}

/* Initialize IndexedDB if needed and hold a promise for later use */

/* Populate the saved drafts sidebar with available jobs */
async function loadDraftList() {
  const jobs = (await getAll('jobs')).map(normalizeJob).sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
  if (!jobs.length) {
    els.jobList.innerHTML = '<p class="muted small">No saved drafts yet.</p>';
    return;
  }

  els.jobList.innerHTML = '';
  jobs.forEach(job => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'draft-button';
    const doc = getDocumentDefinition(job.documentType);
    const title = draftTitle(job, 'Untitled Document');
    btn.innerHTML = `<strong>${escapeHtml(title)}</strong><small>${escapeHtml(doc.label)}</small><small>${escapeHtml(job.fields?.address || '')}</small><small>Updated ${new Date(job.updatedAt).toLocaleString()}</small>`;

    btn.addEventListener('click', async () => {
      if (isDirty() && !confirm('Load this draft? Unsaved changes will be lost.')) return;
      try {
        const full = await getJob(job.id);
        if (!full) throw new Error('Saved draft could not be found.');
        hydrateForm(full);
        await renderPhotos();
      } catch (err) {
        console.error('Draft load failed', err);
        setStatus(`Could not load draft: ${err.message || 'unknown error'}`);
      }
    });

    els.jobList.appendChild(btn);
  });
}

function draftTitle(job, fallback = 'Untitled Document') {
  const doc = getDocumentDefinition(job?.documentType);
  const parts = [job?.fields?.jobNumberPhase, job?.fields?.customerName].filter(Boolean);
  return parts.length ? `${parts.join(' - ')} (${doc.shortLabel})` : `${fallback} (${doc.shortLabel})`;
}


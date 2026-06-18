'use strict';

/*
  App constants and store definitions
*/
const DB_NAME = 'absolute-precon-offline-v2';
const DB_VERSION = 1;

/* PDF page dimensions and design constants */
const PAGE_W = 612;
const PAGE_H = 792;
const MARGIN = 42;

const PDF_COLORS = {
  plum: [0.208, 0.075, 0.243],
  orange: [0.945, 0.357, 0.165],
  lime: [0.784, 0.906, 0.157],
  teal: [0, 0.557, 0.690],
  paleLime: [0.984, 1, 0.941],
  white: [1, 1, 1]
};

/* Standard selections used in multiple checklist items */
const CUSTOMER_ACK_OPTIONS = ['', 'Customer Acknowledges', 'N/A'];

/* Text blocks displayed on the form for selected checklist options */
const DISPLAYED_WORDING = {
  irrigationLines: [['Customer Acknowledges', "Customer understands and acknowledges that Absolute Aluminum will not handle anything to do with sprinklers/lines etc. and that it is the customer's responsibility."]],
  bushes: [['Customer Acknowledges', 'Customer understands and acknowledges their responsibility to ensure the work area is prepared and cleared of vegetation prior to our arrival. A minimum of 2 feet of clearance is required around the work area. Vegetation taller than 3 feet must be trimmed down to allow safe ladder placement and access.']],
  equipment: [['Customer Acknowledges', 'Customer understands and acknowledges that Absolute Aluminum is not responsible for any damage to landscaping, sod, sprinklers, yard ruts etc. in work area. In some instances, we will hold off on your project during the rainy season to avoid severe damage to your yard. Re-sodding around foundation work is not included.']],
  drawPayment: [['Customer Acknowledges', 'Customer has received, understands and acknowledges the draw schedule and will submit payments accordingly.']],
  tearoutTarping: [['Customer Acknowledges', 'Customer understands and acknowledges that the pool cannot be tarped as this is a life safety issue.']],
  tearoutCleanup: [['Customer Acknowledges', 'Customer understands and acknowledges our process is to cut back and clean up old caulking as best we can as well as fill old holes. This does not include painting or stucco repair.']],
  superGutterTearout: [
    ['By Others', 'To be torn out by someone else.'],
    ['By AA + Release Required', 'To be torn out by Absolute Aluminum and Customer will sign Release of Liability.']
  ],
  survey: [
    ['Customer to Provide', 'Customer will provide the boundary survey required for this project as contracted.'],
    ['AA to Provide', 'Absolute Aluminum will provide the boundary survey required for this project as required.']
  ],
  woodRotWoodRepairs: [['Customer Acknowledges', 'Customer understands and acknowledges that if any wood rot is found during construction they will be informed and will be responsible for any repair. Absolute Aluminum does not repair any wood nor is there any wood repair of any kind in this contract.']],
  clauseOnContract: [['Customer Acknowledges', 'Customer understands and acknowledges all clauses in contract that are applicable.']],
  measure: [['Customer Acknowledges', 'Customer has received, understands and acknowledges the scheduling dates via email. Customer is aware that any changes to the schedule will be sent via email/text and reflect updated dates.']],
  construction: [['Customer Acknowledges', 'Customer has received, understands and acknowledges the scheduling dates via email. Customer is aware that any changes to the schedule will be sent via email/text and reflect updated dates.']],
  installShavings: [['Customer Acknowledges', 'Customer understands and acknowledges that shavings are possible.']],
  qualityControl: [['Customer Acknowledges', 'Customer understands and acknowledges.']],
  finalPayment: [['Customer Acknowledges', 'Customer understands and acknowledges that the final payment is due upon substantial completion and not the final inspections if applicable.']],
  guildQuality: [['Customer Acknowledges', 'Customer understands and acknowledges.']],
  undergroundDrainClause: [['Customer Acknowledges + Release', 'Customer understands and acknowledges. Customer will sign Release of Liability.']],
  expectations: [['Customer Acknowledges', 'Customer understands and acknowledges that no expectations have been set that are not expressly written in this contract.']]
};

/* Fields captured for each job checklist */
const JOB_FIELDS = [
  { id: 'customerName', label: 'Customer Name', type: 'text' },
  { id: 'address', label: 'Address', type: 'text' },
  { id: 'email', label: 'Email', type: 'email' },
  { id: 'phone', label: 'Phone #', type: 'tel' },
  { id: 'jobNumberPhase', label: 'Job # and Phase', type: 'text' },
  { id: 'gateCode', label: 'Gate Code', type: 'text' },
  { id: 'preconSpecialist', label: 'Pre-Construction Specialist', type: 'text' }
];

const INSPECTION_ITEMS = [
  { id: 'irrigationLines', label: 'Irrigation Lines', options: CUSTOMER_ACK_OPTIONS },
  { id: 'bushes', label: 'Bushes', options: CUSTOMER_ACK_OPTIONS },
  { id: 'equipment', label: 'Equipment', options: CUSTOMER_ACK_OPTIONS },
  { id: 'sitePrep', label: 'Site Prep', input: 'text' },
  { id: 'drawPayment', label: 'Draw payment', options: CUSTOMER_ACK_OPTIONS },
  { id: 'tearoutTarping', label: 'Tearout (tarping of the pool)', options: CUSTOMER_ACK_OPTIONS },
  { id: 'tearoutCleanup', label: 'Tearout (Clean up & fill holes)', options: CUSTOMER_ACK_OPTIONS },
  { id: 'superGutterTearout', label: 'Super Gutter Tearout', options: ['', 'By Others', 'By AA + Release Required', 'N/A'] },
  { id: 'houseGutterTearout', label: 'House Gutter Tearout', input: 'text' },
  { id: 'survey', label: 'Survey', options: ['', 'Customer to Provide', 'AA to Provide', 'N/A'] },
  { id: 'paversTravertine', label: 'Pavers/Travertine', input: 'text' },
  { id: 'woodRotWoodRepairs', label: 'Wood Rot/Wood Repairs', options: CUSTOMER_ACK_OPTIONS },
  { id: 'fanBeams', label: 'Fan Beams', input: 'text' },
  { id: 'fanSize', label: 'Fan Size', input: 'text' },
  { id: 'electric', label: 'Electric', input: 'text' },
  { id: 'ezCleans', label: 'EZ Cleans', options: ['', 'Entire Perimeter', 'Front Wall Only', 'None', 'N/A'] },
  { id: 'armourPlate', label: 'Armour Plate', options: ['', 'Entire Bottom Perimeter', 'Front Wall Bottom Only', 'New 1x2 Bottom Only', 'None', 'N/A'] },
  { id: 'rollDownScreens', label: 'Roll Down Screens', input: 'text' },
  { id: 'screenType', label: 'Screen Type', options: ['', 'No-Seeum Phifer Tuff', 'Phifer Tuff', 'Premium 18-14', 'Premium 20-20', 'Economy 18-14', 'Economy 20-20', 'N/A'] },
  { id: 'totalScreenSqft', label: 'Total Screen Square Footage', input: 'text' },
  { id: 'colorSelections', label: 'Color Selections', options: ['', 'Bronze', 'White', 'N/A'] },
  { id: 'fastenerType', label: 'Fastener Type', options: ['', 'Pro-Tec 304 SS', 'Ultra Coat 410 SS', '316 SS + Pro-Tec', 'N/A'] },
  { id: 'downspoutsDischarges', label: 'Downspouts/Discharges', input: 'text' },
  { id: 'doorLocationsSwing', label: 'Door Locations/Swing (Threshold)', input: 'text' },
  { id: 'doorHandleHeight', label: 'Door Handle Height', options: ['', '36"', '54"', 'N/A'] },
  { id: 'clauseOnContract', label: 'Clause on Contract', options: CUSTOMER_ACK_OPTIONS },
  { id: 'measure', label: 'Measure', options: CUSTOMER_ACK_OPTIONS },
  { id: 'communicationPreference', label: 'Communication Preference', options: ['', 'Email', 'Text', 'Call', 'N/A'] },
  { id: 'construction', label: 'Construction', options: CUSTOMER_ACK_OPTIONS },
  { id: 'installShavings', label: 'Install/Possible Shavings', options: CUSTOMER_ACK_OPTIONS },
  { id: 'warrantyInformation', label: 'Warranty Information', options: ['', '5 Year Abso-Shield', 'N/A'] },
  { id: 'tuffScreenWarranty', label: 'Tuff Screen Warranty', options: ['', '10 Year Manufacturers Warranty', 'N/A'] },
  { id: 'qualityControl', label: 'Quality Control/Inspections/Permits', options: CUSTOMER_ACK_OPTIONS },
  { id: 'finalPayment', label: 'Final Payment', options: CUSTOMER_ACK_OPTIONS },
  { id: 'guildQuality', label: 'Guild Quality', options: CUSTOMER_ACK_OPTIONS },
  { id: 'checkForFlashing', label: 'Check For Flashing', input: 'text' },
  { id: 'hoa', label: 'HOA', options: ['', 'Approved', 'Needs Approval', 'N/A'] },
  { id: 'cageRoofStyle', label: 'Cage Roof Style', options: ['', 'Mansard', 'Hip', 'A-Frame', 'Gable', 'Half Mansard', 'Flat', 'Shed', 'Custom', 'N/A'] },
  { id: 'wallOptions', label: 'Wall Options', options: ['', 'Standard with Posts', 'Front Wall Only Absoview', 'Full Absoview', 'N/A'] },
  { id: 'chairRailHeight', label: 'Chair Rail Height', options: ['', '16"', '24"', '30"', '36"', '40"', '48"', 'N/A'] },
  { id: 'nebula', label: 'Nebula', options: ['', 'Colored LEDs', 'White LEDs', 'N/A'] },
  { id: 'pergola', label: 'Pergola', input: 'text' },
  { id: 'dogDoor', label: 'Dog Door', options: ['', 'S', 'M', 'L', 'XL', 'N/A'] },
  { id: 'passThruDoors', label: 'Pass Thru Doors', options: ['', '1', '2', 'N/A'] },
  { id: 'undergroundDrainClause', label: 'Underground Drain Clause', options: ['', 'Customer Acknowledges + Release', 'N/A'] },
  { id: 'expectations', label: 'Expectations', options: CUSTOMER_ACK_OPTIONS }
];

/* In-house checklist items for internal notes and measurements */
const IN_HOUSE_ITEMS = [
  { id: 'limitedWorkArea', label: 'Limited Work Area', input: 'text' },
  { id: 'gutterEndCaps', label: 'Gutter End Caps', input: 'text' },
  { id: 'plumbAngledFascia', label: 'Plumb or Angled Fascia', options: ['', 'Plumb', 'Angled', 'N/A'] },
  { id: 'freezeBoard', label: 'Freeze Board', input: 'text' },
  { id: 'postReplacement', label: 'Post Replacement', input: 'text' },
  { id: 'eveHeightCageHeight', label: 'Eve Height/Cage Height', input: 'text' },
  { id: 'doorPads', label: 'Door Pad(s)', input: 'text' },
  { id: 'existingBoxMiter', label: 'Existing Box Miter', input: 'text' },
  { id: 'overhangDimensions', label: 'Overhang Dimensions', input: 'text' },
  { id: 'stepUpDimensions', label: 'Step-Up Dimensions', input: 'text' },
  { id: 'bayWindowMeasurements', label: 'Bay Window Measurements', input: 'text' },
  { id: 'noc', label: 'NOC', options: ['', 'Needs Signature/Submittal', 'Signed and Submitted', 'N/A'] }
];

const QC_JOB_FIELDS = [
  { id: 'customerName', label: 'Customer Name', type: 'text' },
  { id: 'address', label: 'Address', type: 'text' },
  { id: 'jobNumberPhase', label: 'Job # and Phase', type: 'text' },
  { id: 'qualityControlDate', label: 'Quality Control Date', type: 'date' },
  { id: 'qualityControlInspector', label: 'Quality Control Inspector', type: 'text' },
  { id: 'crewLead', label: 'Crew Lead', type: 'text' },
  { id: 'projectType', label: 'Project Type', type: 'text' },
  { id: 'permitNumber', label: 'Permit #', type: 'text' }
];

const QC_INSPECTION_ITEMS = [
  { id: 'superGutterSeamsFastened', label: 'Super Gutter seams fastened tight', options: ['', 'Yes', 'No'] },
  { id: 'doorsOperationalAndLock', label: 'Doors are operational and lock', options: ['', 'Yes', 'No'] },
  { id: 'doorKeepersRemovedExplained', label: 'Door keepers removed and explained to customers', options: ['', 'Yes', 'No'] },
  { id: 'bugSweepsNoGaps', label: 'Bug sweeps installed with no gaps', options: ['', 'Yes', 'No'] },
  { id: 'weepHoleAtBeamCaps', label: 'Weep hole at beam caps', options: ['', 'Yes', 'No'] },
  { id: 'screwProtecCapsComplete', label: 'Screw/Protec caps fasteners are complete', options: ['', 'Yes', 'No'] },
  { id: 'caulkingInsideOutside', label: 'Caulking is applied inside and outside', options: ['', 'Yes', 'No'] },
  { id: 'ezCleansProperlyInstalled', label: 'EZ Cleans are properly installed', options: ['', 'Yes', 'No'] },
  { id: 'openAreasGapsAddressed', label: 'Open area or gaps have been addressed', options: ['', 'Yes', 'No'] },
  { id: 'beamCapsInstalledProperly', label: 'Beam caps installed properly', options: ['', 'Yes', 'No'] },
  { id: 'screenFreeOfDefects', label: 'Screen is free of defects, wrinkles, and bubbles', options: ['', 'Yes', 'No'] },
  { id: 'cableNutsTightNoPaverRub', label: 'Cable is and cable nuts are tight and not rubbing on pavers', options: ['', 'Yes', 'No'] },
  { id: 'groundWireAttached', label: 'Ground wire is attached from cage to pump', options: ['', 'Yes', 'No'] },
  { id: 'retractableScreensOperational', label: 'Retractable screens are operational', options: ['', 'Yes', 'No'] }
];

const QC_GUTTER_ITEMS = [
  { id: 'downspoutsProperLocation', label: 'Downspouts installed in proper location', options: ['', 'Yes', 'No'] },
  { id: 'downspoutElbowsExtensionsInstalled', label: 'Downspouts ground level elbow with extensions are installed', options: ['', 'Yes', 'No'] },
  { id: 'divertersInstalled', label: 'Diverters Installed', options: ['', 'Yes', 'No'] },
  { id: 'leafGuardInstalled', label: 'Leaf Guard system installed', options: ['', 'Yes', 'No'] },
  { id: 'superGutterSeamsLeakFree', label: 'Super gutter seams are fastened tight and leak free', options: ['', 'Yes', 'No'] },
  { id: 'hiddenHangersSealed', label: 'Hidden hangers are properly sealed', options: ['', 'Yes', 'No'] }
];
const QC_PERGOLA_PAN6_ITEMS = [
  { id: 'louversOperational', label: 'Louvers are operational', options: ['', 'Yes', 'No'] },
  { id: 'fansLightsOperational', label: 'Fans/lights are operational', options: ['', 'Yes', 'No'] },
  { id: 'materialScratchDentFree', label: 'Material is scratch & dent free', options: ['', 'Yes', 'No'] },
  { id: 'superGutterSeamsNeatLeakFree', label: 'Super gutter seams are fastened neat and leak free', options: ['', 'Yes', 'No'] },
  { id: 'doorsOperationalAndLockPergola', label: 'Doors are operational and lock', options: ['', 'Yes', 'No'] },
  { id: 'doorKeepersRemovedExplainedPergola', label: 'Door keepers removed and explained to customers', options: ['', 'Yes', 'No'] },
  { id: 'bugSweepsNoGapsPergola', label: 'Bug sweeps installed with no gaps', options: ['', 'Yes', 'No'] },
  { id: 'weepHoleAtBeamCapsPergola', label: 'Weep hole at beam caps', options: ['', 'Yes', 'No'] },
  { id: 'screwProtecCapsCompletePergola', label: 'Screw/Protec caps fasteners are complete', options: ['', 'Yes', 'No'] },
  { id: 'caulkingInsideOutsidePergola', label: 'Caulking is applied inside and outside', options: ['', 'Yes', 'No'] },
  { id: 'ezCleansProperlyInstalledPergola', label: 'EZ cleans are properly installed', options: ['', 'Yes', 'No'] },
  { id: 'openAreasGapsAddressedPergola', label: 'Open areas or gaps have been addressed', options: ['', 'Yes', 'No'] },
  { id: 'screenFreeOfDefectsPergola', label: 'Screen is free of defects, wrinkles & bubbles', options: ['', 'Yes', 'No'] },
  { id: 'retractableScreensOperationalPergola', label: 'Retractable screens are operational', options: ['', 'Yes', 'No'] }
];

const QC_GENERAL_ITEMS = [
  { id: 'jobSiteClean', label: 'Job Site Clean', options: ['', 'Yes', 'No'] },
  { id: 'completionPerContract', label: 'Completion of Job per Contract', options: ['', 'Yes', 'No'] },
  { id: 'permitPosted', label: 'Permit Posted', options: ['', 'Yes', 'No'] },
  { id: 'overallSatisfaction', label: 'Overall Satisfaction', options: ['', 'Yes', 'No'] },
  { id: 'surveys', label: 'Surveys', options: ['', 'Yes', 'No'] },
  { id: 'paymentCollected', label: 'Payment Collected', options: ['', 'Yes', 'No'] },
  { id: 'tervisTumblers', label: 'Tervis Tumblers', options: ['', 'Yes', 'No'] }
];

const QC_CORRECTIVE_ITEMS = [
  { id: 'openItems', label: 'Open Correction Items', input: 'text' },
  { id: 'assignedTo', label: 'Assigned To', input: 'text' },
  { id: 'targetCompletionDate', label: 'Target Completion Date', input: 'text' },
  { id: 'followUpRequired', label: 'Follow-Up Required', options: ['', 'Yes', 'No'] },
  { id: 'finalQcStatus', label: 'Final QC Status', options: ['', 'Passed', 'Passed With Corrections', 'Failed / Needs Return Visit'] }
];

const DOCUMENT_TYPES = {
  precon: {
    id: 'precon',
    label: 'Pre-Construction Checklist',
    shortLabel: 'Pre-Con',
    title: 'Pre-Construction Checklist',
    pdfTitle: 'PRE-CONSTRUCTION CHECKLIST',
    filenameLabel: 'PreConstruction',
    defaultFilename: 'PreCon',
    summaryPlaceholder: 'Enter pre-construction summary notes...',
    footerNote: 'Photos follow signature page when included',
    signatureText: 'By signing below, customer acknowledges the Pre-Construction Checklist and all included selections, notes, and attachments.',
    fields: JOB_FIELDS,
    displayedWording: DISPLAYED_WORDING,
    groups: [
      { key: 'items', title: 'Inspection Items', pdfTitle: 'INSPECTION ITEMS', continuedTitle: 'Inspection Items continued', items: INSPECTION_ITEMS },
      { key: 'inHouse', title: 'In-House Use', pdfTitle: 'IN-HOUSE USE', continuedTitle: 'In-House Use continued', items: IN_HOUSE_ITEMS }
    ]
  },
  qualityControl: {
    id: 'qualityControl',
    label: 'Quality Control Document',
    shortLabel: 'Quality Control',
    title: 'Quality Control Document',
    pdfTitle: 'QUALITY CONTROL DOCUMENT',
    filenameLabel: 'QualityControl',
    defaultFilename: 'QualityControl',
    summaryPlaceholder: 'Enter quality control summary notes...',
    footerNote: 'Photos follow signature page when included',
    signatureText: 'By signing below, customer acknowledges the Quality Control document and all included observations, correction items, notes, and attachments.',
    fields: QC_JOB_FIELDS,
    displayedWording: {},
    groups: [
      { key: 'items', title: 'Enclosures', pdfTitle: 'ENCLOSURES', continuedTitle: 'Enclosures continued', items: QC_INSPECTION_ITEMS },
      { key: 'gutters', title: 'Gutters', pdfTitle: 'GUTTERS', continuedTitle: 'Gutters continued', items: QC_GUTTER_ITEMS },
      { key: 'pergolaPan6', title: 'Pergola & Pan6', pdfTitle: 'PERGOLA & PAN6', continuedTitle: 'Pergola & Pan6 continued', items: QC_PERGOLA_PAN6_ITEMS },
      { key: 'general', title: 'General Section', pdfTitle: 'GENERAL SECTION', continuedTitle: 'General Section continued', items: QC_GENERAL_ITEMS },
      { key: 'inHouse', title: 'Corrections / Follow-Up', pdfTitle: 'CORRECTIONS / FOLLOW-UP', continuedTitle: 'Corrections / Follow-Up continued', items: QC_CORRECTIVE_ITEMS }
    ]
  }
};

const DEFAULT_DOCUMENT_TYPE = 'precon';

const REQUIRED_ELEMENT_IDS = [
  'installBtn', 'newJobBtn', 'saveBtn', 'jobList', 'storageStatus', 'currentJobTitle', 'dirtyPill',
  'documentTypeSelect', 'jobInfoFields', 'inspectionSectionTitle', 'inspectionItems', 'inHouseSectionTitle', 'inHouseItems',
  'extraDocumentSections', 'summaryNotes', 'addPhotosBtn', 'photoInput', 'photoGrid',
  'refreshPhotosBtn', 'clearPhotosBtn', 'signedPdfBtn', 'outputStatus',
  'typedSignatureName', 'useTypedSignatureBtn', 'signatureCanvas', 'clearSignatureBtn', 'signatureStatus',
  'bottomSaveBtn', 'bottomSignedPdfBtn', 'bottomOutputStatus',
  'checklistForm'
];

let dbPromise;
let currentJob = blankJob();
let deferredInstallPrompt = null;
const els = {};
const photoUrls = new Map();
let signatureDrawing = false;
let signatureHasInk = false;
let signatureImageData = '';
let signatureTypedName = '';

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

function createId(prefix) {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
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

async function putStore(storeName, value) { return txStore(storeName, 'readwrite', store => store.put(value)); }
async function deleteStore(storeName, id) { return txStore(storeName, 'readwrite', store => store.delete(id)); }
async function getAll(storeName) {
  const db = await dbPromise;
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const req = tx.objectStore(storeName).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}
async function getJob(id) {
  const db = await dbPromise;
  return new Promise((resolve, reject) => {
    const tx = db.transaction('jobs', 'readonly');
    const req = tx.objectStore('jobs').get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

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

/* Return photos that belong to the current job, sorted by their sort key */
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

/* Generate the selected document PDF packet from current job data */
async function generatePacket() {
  try {
    setStatus('Building PDF packet...');
    currentJob = collectJobFromForm();
    await putStore('jobs', currentJob);
    await loadDraftList();

    const photos = await getCurrentPhotos();
    const bytes = await buildDocumentPacketPdf(currentJob, photos);
    const filename = packetFilename(currentJob);
    const blob = new Blob([bytes], { type: 'application/pdf' });
    downloadBlob(blob, filename);
    setStatus(`Generated ${filename} (${formatBytes(blob.size)}).`);
  } catch (err) {
    console.error(err);
    alert(`Could not generate PDF: ${err.message}`);
    setStatus('PDF generation failed.');
  }
}

function packetFilename(job) {
  const doc = getDocumentDefinition(job.documentType);
  const jobNum = safeFilename(job.fields?.jobNumberPhase || doc.defaultFilename);
  const customer = safeFilename(job.fields?.customerName || 'Customer');
  const signatureState = job.signatureImage ? 'SIGNED' : 'PRE-SIGNATURE';
  return `${jobNum}-${customer}-${doc.filenameLabel}-${signatureState}.pdf`;
}

function packetSubtitle(job) {
  return job.signatureImage ? 'In-person signed packet' : 'Pre-signature packet';
}

/* Build the PDF document structure for the selected packet */
async function buildDocumentPacketPdf(job, photos) {
  job = normalizeJob(job);
  const doc = { pages: [], logo: await loadPdfLogo(), editLocked: Boolean(job.signatureImage) };
  await addDocumentPages(doc, job);
  await addPhotoPages(doc, job, photos);
  return buildPdf(doc);
}

/* Add the main form pages to the PDF document */
async function addDocumentPages(doc, job) {
  const definition = getDocumentDefinition(job.documentType);
  let page = newPdfPage(doc.logo);
  let y = startPdfPage(page, job, packetSubtitle(job));
  const jobFields = filledJobFields(job, definition);

  if (jobFields.length) {
    y = sectionBar(page, 'JOB INFORMATION', y);
    y = addJobInfo(page, job, y, jobFields);
  }

  for (const group of definition.groups) {
    const groupItems = filledItems(group.items, job[group.key]);
    if (groupItems.length) {
      ({ page, y } = ensurePageSpace(doc, page, job, y + 6, 48, group.continuedTitle));
      y = sectionBar(page, group.pdfTitle, y);
      ({ page, y } = addItemTable(doc, page, job, groupItems, job[group.key], y, group.continuedTitle));
    }
  }

  if (hasPdfValue(job.summaryNotes)) {
    ({ page, y } = ensurePageSpace(doc, page, job, y + 8, 110, 'Summary'));
    y = sectionBar(page, 'SUMMARY NOTES', y);
    y = addSummaryBlock(page, job, y);
  }

  addFooter(page, job);
  doc.pages.push(page);

  const sigPage = newPdfPage(doc.logo);
  startPdfPage(sigPage, job, job.signatureImage ? 'Captured signature page' : 'Signature page');
  await addSignatureBlock(sigPage, job, 156);
  addFooter(sigPage, job);
  doc.pages.push(sigPage);
}

/* Create an empty PDF page container */
function newPdfPage(logo = null) { return { commands: [], images: [], annotations: [], logo }; }

/* Load and prepare the logo that is embedded in PDF pages */
async function loadPdfLogo() {
  try {
    return await dataUrlToJpegImage(await blobToDataUrl(await fetch('assets/absolute-aluminum-logo.png').then(response => response.blob())), 520, 0.9);
  } catch (err) {
    console.warn('Logo could not be embedded in PDF', err);
    return null;
  }
}

/* Add the document header to each PDF page */
function startPdfPage(page, job, subtitle = 'Pre-signature packet') {
  addHeader(page, getDocumentDefinition(job.documentType).pdfTitle, job, 28, subtitle);
  return 104;
}

/* Draw the PDF title header and metadata */
function addHeader(page, title, job, yTop, subtitle = '') {
  rect(page, 32, yTop - 8, PAGE_W - 64, 68, PDF_COLORS.white);
  rectStroke(page, 32, yTop - 8, PAGE_W - 64, 68, PDF_COLORS.plum);
  rect(page, 32, yTop + 56, PAGE_W - 64, 4, PDF_COLORS.lime);
  rect(page, 32, yTop + 60, PAGE_W - 64, 3, PDF_COLORS.orange);
  if (page.logo) imageOnPage(page, page.logo, 42, yTop + 1, 112, 48);
  text(page, title, page.logo ? 170 : 44, yTop + 15, 17, 'F2', PDF_COLORS.plum);
  text(page, subtitle || 'Pre-signature packet', page.logo ? 170 : 44, yTop + 39, 9, 'F1', PDF_COLORS.teal);
  if (job.fields?.jobNumberPhase) textRight(page, job.fields.jobNumberPhase, PAGE_W - 44, yTop + 17, 10, 'F2', PDF_COLORS.plum);
  textRight(page, new Date().toLocaleDateString(), PAGE_W - 44, yTop + 39, 9, 'F1', PDF_COLORS.teal);
}

function sectionBar(page, title, y) {
  rect(page, MARGIN, y, PAGE_W - MARGIN * 2, 18, PDF_COLORS.plum);
  text(page, title, MARGIN + 8, y + 12, 9, 'F2', PDF_COLORS.white);
  return y + 24;
}

/* Ensure enough space remains on the current PDF page or create a new page */
function ensurePageSpace(doc, page, job, y, needed, subtitle) {
  if (y + needed <= 736) return { page, y, newPage: false };
  addFooter(page, job);
  doc.pages.push(page);
  const nextPage = newPdfPage(doc.logo);
  const nextY = startPdfPage(nextPage, job, subtitle);
  return { page: nextPage, y: nextY, newPage: true };
}

/* Draw the footer on a PDF page */
function addFooter(page, job = currentJob) {
  const definition = getDocumentDefinition(job?.documentType);
  line(page, MARGIN, 758, PAGE_W - MARGIN, 758, PDF_COLORS.teal);
  text(page, definition.title, MARGIN, 774, 7, 'F1', PDF_COLORS.teal);
  textRight(page, definition.footerNote, PAGE_W - MARGIN, 774, 7, 'F1', PDF_COLORS.teal);
}

/* Helpers for filtering fields and items that should be printed */
function filledJobFields(job, definition = getDocumentDefinition(job.documentType)) {
  return definition.fields.filter(field => hasPdfValue(job.fields?.[field.id]));
}

function filledItems(items, values) {
  return items.filter(item => itemHasPdfValue(item, values?.[item.id] || {}));
}

function hasPdfValue(value) {
  return String(value ?? '').trim().length > 0;
}

function itemHasPdfValue(item, row) {
  return item.options ? hasPdfValue(row.selection) : hasPdfValue(row.value);
}

function selectedWording(item, row) {
  const selection = row.selection || '';
  return (getDocumentDefinition(currentJob?.documentType).displayedWording?.[item.id] || []).filter(([sel]) => sel === selection);
}

/* Render job fields into the PDF in two columns */
function addJobInfo(page, job, y, fields = filledJobFields(job)) {
  const colW = (PAGE_W - MARGIN * 2) / 2;
  fields.forEach((field, idx) => {
    const x = idx % 2 === 0 ? MARGIN : MARGIN + colW;
    if (idx > 0 && idx % 2 === 0) y += 28;
    labelValue(page, field.label, job.fields?.[field.id] || '', x, y, colW);
  });
  return y + 34;
}

function labelValue(page, label, value, x, y, width) {
  rectStroke(page, x, y, width, 24, PDF_COLORS.teal);
  rect(page, x, y, width, 8, PDF_COLORS.paleLime);
  text(page, label, x + 5, y + 6, 6.5, 'F2', PDF_COLORS.plum);
  wrappedText(page, value || ' ', x + 5, y + 19, width - 10, 8, 9, 'F1', 1);
}

function itemDisplayValue(item, row) {
  return item.options ? row.selection || '' : row.value || '';
}

function itemRowHeight(item, row) {
  const messageLines = wrapText(itemPdfMessage(item, row), 112).length;
  return Math.max(34, 22 + messageLines * 9);
}

/* Add a table of checklist items to the PDF */
function addItemTable(doc, page, job, items, values, y, continuationTitle) {
  for (const item of items) {
    const row = values?.[item.id] || {};
    const h = itemRowHeight(item, row);
    const ensured = ensurePageSpace(doc, page, job, y, h + 2, continuationTitle);
    page = ensured.page;
    y = ensured.y;
    if (ensured.newPage) {
      y = sectionBar(page, continuationTitle.replace(' continued', '').toUpperCase(), y);
    }
    addItemRow(page, item, row, y, h);
    y += h;
  }
  return { page, y: y + 6 };
}

function addItemRow(page, item, row, y, h) {
  rectStroke(page, MARGIN, y, PAGE_W - MARGIN * 2, h, PDF_COLORS.teal);
  rect(page, MARGIN, y, PAGE_W - MARGIN * 2, 14, PDF_COLORS.paleLime);
  text(page, item.label, MARGIN + 8, y + 10, 9.5, 'F2', PDF_COLORS.plum);
  wrappedText(page, itemPdfMessage(item, row), MARGIN + 8, y + 25, PAGE_W - MARGIN * 2 - 16, 8.2, 9.2, 'F1');
}

function itemPdfMessage(item, row) {
  const wording = selectedWording(item, row);
  if (wording.length) return wording.map(([, body]) => body).join(' ');
  return itemDisplayValue(item, row);
}

/* Add summary notes block to the PDF */
function addSummaryBlock(page, job, y) {
  const h = Math.min(128, Math.max(54, wrapText(job.summaryNotes || ' ', 116).length * 9 + 18));
  rectStroke(page, MARGIN, y, PAGE_W - MARGIN * 2, h, PDF_COLORS.teal);
  wrappedText(page, job.summaryNotes || ' ', MARGIN + 8, y + 16, PAGE_W - MARGIN * 2 - 16, 8, 9.5, 'F1');
  return y + h + 6;
}

/* Add the signature section to the PDF */
async function addSignatureBlock(page, job, y) {
  const definition = getDocumentDefinition(job.documentType);
  y = sectionBar(page, 'CUSTOMER ACKNOWLEDGMENT', y);
  wrappedText(page, definition.signatureText, MARGIN, y + 6, PAGE_W - MARGIN * 2, 10, 13, 'F1');
  y += 86;
  if (job.signatureImage) {
    try {
      const signature = await dataUrlToJpegImage(job.signatureImage, 900, 0.92);
      const fit = fitRect(signature.width, signature.height, 292, 42);
      imageOnPage(page, signature, MARGIN + 4, y - 46 + (42 - fit.h) / 2, fit.w, fit.h);
    } catch (err) {
      console.warn('Captured signature could not be embedded', err);
      throw new Error('Captured signature could not be embedded in the locked PDF.');
    }
  } else {
    addSignatureField(page, 'CustomerSignature', MARGIN, y - 34, 300, 34);
  }
  line(page, MARGIN, y, MARGIN + 300, y, PDF_COLORS.teal);
  text(page, 'Customer Signature', MARGIN, y + 16, 8, 'F2', PDF_COLORS.plum);
  labelValue(page, 'Customer Printed Name', job.signatureName || job.fields?.customerName || '', MARGIN, y + 42, 250);
  labelValue(page, 'Date', formatDateForPdf(job.signatureDate), 330, y + 42, 160);
  if (job.signatureImage) {
    wrappedText(page, 'Local signature captured. This PDF is locked against editing in standard PDF viewers.', MARGIN, y + 98, PAGE_W - MARGIN * 2, 8, 10, 'F1', 2);
  }
}

function addSignatureField(page, name, xTop, yTop, w, h) {
  page.annotations.push({
    type: 'signature',
    name,
    rect: pdfRectFromTopLeft(xTop, yTop, w, h)
  });
}

function pdfRectFromTopLeft(xTop, yTop, w, h) {
  return [xTop, PAGE_H - yTop - h, xTop + w, PAGE_H - yTop];
}

/* Add photo pages into the PDF, two photos per page */
async function addPhotoPages(doc, job, photos) {
  if (!photos.length) return;

  let pageNum = 1;
  for (let i = 0; i < photos.length; i += 2) {
    const page = newPdfPage(doc.logo);
    addHeader(page, getDocumentDefinition(job.documentType).pdfTitle, job, 44, `Photo Page ${pageNum}`);
    const slots = [
      { x: MARGIN, y: 126, w: PAGE_W - MARGIN * 2, h: 250 },
      { x: MARGIN, y: 424, w: PAGE_W - MARGIN * 2, h: 250 }
    ];

    for (let j = 0; j < 2 && i + j < photos.length; j++) {
      const photo = photos[i + j];
      const image = await photoToJpegImage(photo, 1700, 0.74);
      const slot = slots[j];
      rectStroke(page, slot.x, slot.y, slot.w, slot.h, PDF_COLORS.teal);
      const fit = fitRect(image.width, image.height, slot.w - 16, slot.h - 44);
      imageOnPage(page, image, slot.x + (slot.w - fit.w) / 2, slot.y + 10, fit.w, fit.h);
      wrappedText(page, photo.caption || `Photo ${i + j + 1}`, slot.x + 8, slot.y + slot.h - 20, slot.w - 16, 9, 11, 'F1', 2);
    }

    addFooter(page, job);
    doc.pages.push(page);
    pageNum++;
  }
}

/* Place an image object on a PDF page */
function imageOnPage(page, image, xTop, yTop, w, h) {
  const name = `Im${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
  const imageObj = { ...image, name };
  page.images.push(imageObj);
  page.commands.push(`q ${fmt(w)} 0 0 ${fmt(h)} ${fmt(xTop)} ${fmt(PAGE_H - yTop - h)} cm /${name} Do Q`);
}

/* PDF text drawing helpers */
function text(page, value, x, yTop, size = 10, font = 'F1', color = null) {
  const command = `BT /${font} ${fmt(size)} Tf ${fmt(x)} ${fmt(PAGE_H - yTop)} Td (${escapePdfString(pdfCleanText(value))}) Tj ET`;
  page.commands.push(color ? `q ${pdfRgb(color)} rg ${command} Q` : command);
}

function textRight(page, value, rightX, yTop, size = 10, font = 'F1', color = null) {
  text(page, value, rightX - String(value).length * size * 0.52, yTop, size, font, color);
}

function wrappedText(page, value, x, yTop, width, size = 10, lineHeight = 12, font = 'F1', maxLines = Infinity) {
  const chars = Math.max(12, Math.floor(width / (size * 0.52)));
  const lines = wrapText(value, chars).slice(0, maxLines);
  lines.forEach((lineText, index) => text(page, lineText, x, yTop + index * lineHeight, size, font));
  return yTop + lines.length * lineHeight;
}

function line(page, x1, y1Top, x2, y2Top, color = null) {
  const command = `${fmt(x1)} ${fmt(PAGE_H - y1Top)} m ${fmt(x2)} ${fmt(PAGE_H - y2Top)} l S`;
  page.commands.push(color ? `q ${pdfRgb(color)} RG ${command} Q` : command);
}

function rect(page, x, yTop, w, h, fill = 0.95) {
  const fillColor = Array.isArray(fill) ? `${pdfRgb(fill)} rg` : `${fmt(fill)} g`;
  page.commands.push(`q ${fillColor} ${fmt(x)} ${fmt(PAGE_H - yTop - h)} ${fmt(w)} ${fmt(h)} re f Q`);
}

function rectStroke(page, x, yTop, w, h, color = null) {
  const command = `${fmt(x)} ${fmt(PAGE_H - yTop - h)} ${fmt(w)} ${fmt(h)} re S`;
  page.commands.push(color ? `q ${pdfRgb(color)} RG ${command} Q` : command);
}

function pdfRgb(color) { return color.map(fmt).join(' '); }

/* Convert the page and image model into a raw PDF file */
function buildPdf(doc) {
  const images = [];
  doc.pages.forEach(page => page.images.forEach(img => images.push(img)));
  let nextObj = 5;
  images.forEach(img => { img.obj = nextObj++; });
  doc.pages.forEach(page => { page.contentObj = nextObj++; page.pageObj = nextObj++; });
  const security = doc.editLocked ? createPdfEditLockSecurity() : null;
  if (security) security.obj = nextObj++;
  const annotations = [];
  doc.pages.forEach(page => {
    page.annotations.forEach(annotation => {
      annotation.obj = nextObj++;
      annotation.pageObj = page.pageObj;
      annotations.push(annotation);
    });
  });

  const objects = [];
  objects[1] = catalogObject(annotations);
  objects[2] = `<< /Type /Pages /Kids [${doc.pages.map(p => `${p.pageObj} 0 R`).join(' ')}] /Count ${doc.pages.length} >>`;
  objects[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';
  objects[4] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>';
  if (security) objects[security.obj] = pdfEncryptionObject(security);
  images.forEach(img => { objects[img.obj] = imageObject(img, security, img.obj); });
  annotations.forEach(annotation => { objects[annotation.obj] = annotationObject(annotation); });

  doc.pages.forEach(page => {
    const content = ['0 g', '0.7 w', ...page.commands].join('\n');
    objects[page.contentObj] = streamObject(asciiBytes(content), security, page.contentObj);
    const xObjects = page.images.length ? `/XObject << ${page.images.map(img => `/${img.name} ${img.obj} 0 R`).join(' ')} >>` : '';
    const annots = page.annotations.length ? `/Annots [${page.annotations.map(annotation => `${annotation.obj} 0 R`).join(' ')}]` : '';
    objects[page.pageObj] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> ${xObjects} >> ${annots} /Contents ${page.contentObj} 0 R >>`;
  });

  const chunks = [];
  const offsets = [0];
  pushAscii(chunks, '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');

  for (let i = 1; i < objects.length; i++) {
    offsets[i] = byteLength(chunks);
    pushAscii(chunks, `${i} 0 obj\n`);
    if (objects[i] instanceof Uint8Array) chunks.push(objects[i]); else pushAscii(chunks, objects[i]);
    pushAscii(chunks, '\nendobj\n');
  }

  const xrefOffset = byteLength(chunks);
  pushAscii(chunks, `xref\n0 ${objects.length}\n0000000000 65535 f \n`);
  for (let i = 1; i < objects.length; i++) pushAscii(chunks, `${String(offsets[i]).padStart(10, '0')} 00000 n \n`);
  const encryptionTrailer = security ? ` /Encrypt ${security.obj} 0 R /ID [<${bytesToHex(security.fileId)}> <${bytesToHex(security.fileId)}>]` : '';
  pushAscii(chunks, `trailer\n<< /Size ${objects.length} /Root 1 0 R${encryptionTrailer} >>\nstartxref\n${xrefOffset}\n%%EOF`);
  return concatBytes(chunks);
}

function catalogObject(annotations) {
  const signatureFields = annotations.filter(annotation => annotation.type === 'signature');
  if (!signatureFields.length) return '<< /Type /Catalog /Pages 2 0 R >>';
  return `<< /Type /Catalog /Pages 2 0 R /AcroForm << /Fields [${signatureFields.map(field => `${field.obj} 0 R`).join(' ')}] /SigFlags 3 /NeedAppearances true /DR << /Font << /Helv 3 0 R >> >> /DA (/Helv 0 Tf 0 g) >> >>`;
}

function annotationObject(annotation) {
  if (annotation.type === 'signature') return signatureAnnotationObject(annotation);
  throw new Error(`Unsupported PDF annotation type: ${annotation.type}`);
}

function signatureAnnotationObject(annotation) {
  return `<< /Type /Annot /Subtype /Widget /FT /Sig /T (${escapePdfString(annotation.name)}) /Rect [${annotation.rect.map(fmt).join(' ')}] /F 4 /P ${annotation.pageObj} 0 R /H /I /MK << /BC [0 0.557 0.690] /BG [1 1 1] >> >>`;
}

/* Encode an image object for PDF embedding */
function imageObject(img, security = null, objNum = 0) {
  const bytes = security ? encryptPdfObjectBytes(security, objNum, img.bytes) : img.bytes;
  return concatBytes([
    asciiBytes(`<< /Type /XObject /Subtype /Image /Width ${img.width} /Height ${img.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${bytes.length} >>\nstream\n`),
    bytes,
    asciiBytes('\nendstream')
  ]);
}

function streamObject(bytes, security = null, objNum = 0) {
  const out = security ? encryptPdfObjectBytes(security, objNum, bytes) : bytes;
  return concatBytes([asciiBytes(`<< /Length ${out.length} >>\nstream\n`), out, asciiBytes('\nendstream')]);
}

function createPdfEditLockSecurity() {
  const fileId = randomBytes(16);
  const userPassword = padPdfPassword('');
  const ownerPassword = padPdfPassword(bytesToHex(randomBytes(16)));
  const ownerKey = md5Bytes(ownerPassword).slice(0, 5);
  const ownerEntry = rc4(ownerKey, userPassword);
  const permissions = -44; // Allow open/print/copy, disallow modification and annotation/editing in Adobe.
  const keySeed = concatBytes([userPassword, ownerEntry, int32LeBytes(permissions), fileId]);
  const fileKey = md5Bytes(keySeed).slice(0, 5);
  const userEntry = rc4(fileKey, PDF_PASSWORD_PADDING);

  return { fileId, ownerEntry, userEntry, permissions, fileKey };
}

function pdfEncryptionObject(security) {
  return `<< /Filter /Standard /V 1 /R 2 /Length 40 /O <${bytesToHex(security.ownerEntry)}> /U <${bytesToHex(security.userEntry)}> /P ${security.permissions} >>`;
}

function encryptPdfObjectBytes(security, objNum, bytes, genNum = 0) {
  const objectKeySeed = concatBytes([
    security.fileKey,
    new Uint8Array([objNum & 255, (objNum >> 8) & 255, (objNum >> 16) & 255, genNum & 255, (genNum >> 8) & 255])
  ]);
  const objectKey = md5Bytes(objectKeySeed).slice(0, Math.min(security.fileKey.length + 5, 16));
  return rc4(objectKey, bytes);
}

const PDF_PASSWORD_PADDING = new Uint8Array([
  0x28, 0xbf, 0x4e, 0x5e, 0x4e, 0x75, 0x8a, 0x41,
  0x64, 0x00, 0x4e, 0x56, 0xff, 0xfa, 0x01, 0x08,
  0x2e, 0x2e, 0x00, 0xb6, 0xd0, 0x68, 0x3e, 0x80,
  0x2f, 0x0c, 0xa9, 0xfe, 0x64, 0x53, 0x69, 0x7a
]);

function padPdfPassword(value) {
  const bytes = asciiBytes(String(value || ''));
  const out = new Uint8Array(32);
  out.set(bytes.slice(0, 32));
  if (bytes.length < 32) out.set(PDF_PASSWORD_PADDING.slice(0, 32 - bytes.length), bytes.length);
  return out;
}

function rc4(key, data) {
  const s = new Uint8Array(256);
  for (let i = 0; i < 256; i++) s[i] = i;
  let j = 0;
  for (let i = 0; i < 256; i++) {
    j = (j + s[i] + key[i % key.length]) & 255;
    const tmp = s[i]; s[i] = s[j]; s[j] = tmp;
  }

  const out = new Uint8Array(data.length);
  let i = 0;
  j = 0;
  for (let n = 0; n < data.length; n++) {
    i = (i + 1) & 255;
    j = (j + s[i]) & 255;
    const tmp = s[i]; s[i] = s[j]; s[j] = tmp;
    out[n] = data[n] ^ s[(s[i] + s[j]) & 255];
  }
  return out;
}

function md5Bytes(input) {
  const bytes = input instanceof Uint8Array ? input : asciiBytes(String(input));
  const bitLength = bytes.length * 8;
  const paddedLength = (((bytes.length + 8) >> 6) + 1) * 64;
  const padded = new Uint8Array(paddedLength);
  padded.set(bytes);
  padded[bytes.length] = 0x80;
  for (let i = 0; i < 8; i++) padded[paddedLength - 8 + i] = Math.floor(bitLength / (2 ** (8 * i))) & 255;

  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;
  const s = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21
  ];
  const k = Array.from({ length: 64 }, (_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32) >>> 0);

  for (let chunk = 0; chunk < padded.length; chunk += 64) {
    const m = new Uint32Array(16);
    for (let i = 0; i < 16; i++) {
      const offset = chunk + i * 4;
      m[i] = padded[offset] | (padded[offset + 1] << 8) | (padded[offset + 2] << 16) | (padded[offset + 3] << 24);
    }

    let a = a0;
    let b = b0;
    let c = c0;
    let d = d0;

    for (let i = 0; i < 64; i++) {
      let f;
      let g;
      if (i < 16) {
        f = (b & c) | (~b & d);
        g = i;
      } else if (i < 32) {
        f = (d & b) | (~d & c);
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        f = b ^ c ^ d;
        g = (3 * i + 5) % 16;
      } else {
        f = c ^ (b | ~d);
        g = (7 * i) % 16;
      }

      const temp = d;
      d = c;
      c = b;
      b = (b + leftRotate((a + f + k[i] + m[g]) >>> 0, s[i])) >>> 0;
      a = temp;
    }

    a0 = (a0 + a) >>> 0;
    b0 = (b0 + b) >>> 0;
    c0 = (c0 + c) >>> 0;
    d0 = (d0 + d) >>> 0;
  }

  const out = new Uint8Array(16);
  [a0, b0, c0, d0].forEach((word, index) => {
    out[index * 4] = word & 255;
    out[index * 4 + 1] = (word >> 8) & 255;
    out[index * 4 + 2] = (word >> 16) & 255;
    out[index * 4 + 3] = (word >> 24) & 255;
  });
  return out;
}

function leftRotate(value, shift) {
  return ((value << shift) | (value >>> (32 - shift))) >>> 0;
}

function int32LeBytes(value) {
  const n = value >>> 0;
  return new Uint8Array([n & 255, (n >> 8) & 255, (n >> 16) & 255, (n >> 24) & 255]);
}

function randomBytes(length) {
  const out = new Uint8Array(length);
  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(out);
  } else {
    for (let i = 0; i < length; i++) out[i] = Math.floor(Math.random() * 256);
  }
  return out;
}

function bytesToHex(bytes) {
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

/* Helper to detect image files by MIME type or extension */
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

/* Register the service worker for offline use */
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(err => console.warn('Service worker registration failed', err));
  }
}
/* Download a Blob to the user's device */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

/* Convert a string to ASCII bytes for PDF building */
function asciiBytes(str) {
  const bytes = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) bytes[i] = str.charCodeAt(i) & 0xff;
  return bytes;
}

function pushAscii(chunks, str) { chunks.push(asciiBytes(str)); }
function byteLength(chunks) { return chunks.reduce((total, chunk) => total + chunk.length, 0); }
function concatBytes(chunks) {
  const out = new Uint8Array(byteLength(chunks));
  let offset = 0;
  chunks.forEach(chunk => {
    out.set(chunk, offset);
    offset += chunk.length;
  });
  return out;
}

/* Format numeric values for PDF content streams */
function fmt(n) { return Number(n).toFixed(2).replace(/\.00$/, ''); }
/* Normalize text before embedding it into the PDF */
function pdfCleanText(value) {
  return String(value ?? '')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, '?');
}

/* Escape special characters inside PDF strings */
function escapePdfString(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

/* Wrap text to a maximum character width for PDF output */
function wrapText(value, maxChars) {
  const input = pdfCleanText(value || '').replace(/\s+/g, ' ').trim();
  if (!input) return [''];
  const words = input.split(' ');
  const lines = [];
  let lineText = '';
  words.forEach(word => {
    if ((lineText + ' ' + word).trim().length > maxChars && lineText) {
      lines.push(lineText);
      lineText = word;
    } else {
      lineText = (lineText + ' ' + word).trim();
    }
  });
  if (lineText) lines.push(lineText);
  return lines;
}
/* Format bytes as a human-readable string for UI display */
function formatBytes(bytes) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let n = bytes;
  let i = 0;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(n >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}

function formatDateForPdf(value) {
  if (!value) return '';
  const [year, month, day] = String(value).split('-').map(Number);
  if (!year || !month || !day) return value;
  return `${month}/${day}/${year}`;
}

/* Create a filename safe for download by stripping invalid characters */
function safeFilename(value) {
  return String(value || '')
    .trim()
    .replace(/[^a-z0-9-_]+/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60) || 'PreCon';
}
function escapeHtml(value) {
   return String(value ?? '')
    .replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch])); 
}
function debounce(fn, delay) {
   let timer; return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); }; }


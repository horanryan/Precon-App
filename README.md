# Pre-Con Checklist Offline App

This is a working offline-first starter app for the Absolute Aluminum Pre-Construction Checklist.

It includes:

- Offline app shell with a service worker
- Local IndexedDB draft storage
- Job information fields
- Inspection item dropdowns matching the original PDF options exactly
- In-house-use section with original PDF dropdown/text fields
- Summary notes
- Unlimited photos, limited by the device/browser storage quota
- Photo captions and reorder controls
- Local customer signature capture
- Remote-signature packet generation
- Actual browser-side PDF generation with photo pages appended to the end

The uploaded original PDF is included at:

`assets/Pre-Construction-template.pdf`

The current app recreates the packet as a generated PDF instead of trying to fill Acrobat fields. Dropdown choices were extracted from the original PDF form fields and should match the source PDF options exactly. That avoids iPad/Acrobat dropdown/image-field issues.

---

## How to run it locally

Do not open `index.html` by double-clicking it. Service workers and install/offline behavior require a local web server.

### Windows / Mac quick test

From the `precon-offline-app` folder, run:

```bash
python -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

### iPad field test

Host the folder from a computer on the same Wi-Fi network, then open the computer's local IP address on the iPad, for example:

```text
http://192.168.1.50:8080
```

After the app loads once, use Safari's Share button and choose **Add to Home Screen**.

Once installed/cached, the app shell works offline. Saved drafts and photos remain on that device.

---

## Signature modes

### Local in-person signature

Use this when the customer is standing with the pre-construction specialist.

1. Fill checklist
2. Add photos
3. Customer signs on the signature canvas
4. Tap **Download Signed PDF**
5. The app generates a final signed packet with photo pages appended

### Remote signature

Use this when the customer is not present.

1. Fill checklist
2. Add photos
3. Select **Send for customer signature later**
4. Enter customer email and optional due date/message
5. Tap **Generate / Share Remote-Sign PDF**
6. The app generates an unsigned packet and, where supported, opens the device share sheet
7. Send the PDF by email or upload it into Adobe Acrobat Sign

A fully automated Adobe Sign send requires a secure company backend because Adobe credentials/API tokens must not be stored in the offline app.

---

## Photo behavior

Photos are resized/compressed when imported to reduce storage and final PDF size.

Default import compression:

- Max dimension: 2400 px
- JPEG quality: 86%

Default PDF compression:

- Max dimension: 1700 px
- JPEG quality: 74%

The app can handle many photos, but a huge photo packet can still create a large PDF. The practical limit is the device/browser storage quota and available memory.

For production, if you truly need hundreds of photos reliably on iPad, package this same app as a Capacitor iOS app and store photos in the app filesystem instead of relying only on browser storage.

---

## Production notes

Before using this as the official process, decide these items:

1. Whether local in-person signature is legally acceptable for this checklist workflow.
2. Whether Adobe Sign is required for every signature or only remote signatures.
3. Where final PDFs should be uploaded: SharePoint, OneDrive, OneClick Contractor, Monday.com, or another system.
4. Whether photo originals should be retained separately from the compressed PDF packet.
5. Whether the app needs user login and audit trail.

---

## Files

```text
precon-offline-app/
├── index.html
├── styles.css
├── app.js
├── sw.js
├── manifest.webmanifest
├── README.md
├── assets/
│   ├── icon.svg
│   └── Pre-Construction-template.pdf
└── server/
    └── README-adobe-sign.md
```

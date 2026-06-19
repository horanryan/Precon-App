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
- One Click Contractor-ready signature packet generation
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

## Signature workflow

1. Fill the checklist and add photos.
2. Tap **Download PDF Packet**.
3. Upload the packet to One Click Contractor.
4. One Click Contractor replaces `{{bsr}}` with the customer signature and `{{bdr}}` with the signing date.

The app does not capture or embed local signatures.

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

1. Whether photo originals should be retained separately from the compressed PDF packet.
2. Whether the app needs user login and audit trail.

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

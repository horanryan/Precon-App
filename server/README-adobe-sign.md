# Adobe Sign integration note

The offline app can generate the unsigned PDF packet locally.

A fully automated "Send to Adobe Sign" button should not be implemented directly inside the browser app because Adobe API tokens/client secrets must not be exposed to field devices.

Recommended production design:

```text
Offline App
  ↓ creates unsigned PDF packet
Secure Company Backend
  ↓ uploads transient document to Adobe Acrobat Sign
  ↓ creates agreement for customer email
Adobe Sign
  ↓ customer signs
Webhook / polling
  ↓ completed signed PDF saved to SharePoint/OneDrive/job folder
```

The backend should:

1. Authenticate the employee/device.
2. Receive the generated PDF packet.
3. Call Adobe Sign using company-owned credentials.
4. Create the signing agreement.
5. Store the Adobe agreement ID against the job.
6. Retrieve the completed signed PDF after signing.
7. Upload the signed PDF to the chosen document system.

This folder is intentionally documentation-only because the exact Adobe Sign account, region, OAuth setup, and storage target need to be confirmed before wiring production code.

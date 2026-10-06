# SISCO Catering – Saipem-inspired slider update

Replace your current `App.jsx` and `index.css` with the files in this folder.

This version keeps the existing SISCO structure and `data.js`, but changes:

- Hero into a full-screen image carousel inspired by Saipem's visual navigation style.
- Auto slide every 6 seconds.
- Slide counter, progress bars, and previous/next arrows.
- Service section into three image-led cards:
  1. Project Catering
  2. Workforce Dining
  3. Remote-Site Catering
- Images are pulled from your existing `IMG` object with fallbacks, so no new image package is required.

If you want exact service photos, add keys such as `project`, `workforce`, and `remote` to your existing `IMG` object in `data.js`. The component will use them automatically.

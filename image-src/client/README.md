# Client-supplied originals

Drop originals from the client here, any filename, any format
(.heic / .jpg / .png / .webp). These are the untouched sources — nothing in
here is served directly.

They are converted into `public/images/` by the import step: HEIC is decoded,
resized to a 1600px long edge, and written as JPEG/WebP. Keep the originals so
crops and sizes can be regenerated later without going back to the client.

Send as **Document** in WhatsApp, never as Photo — Photo re-compresses.

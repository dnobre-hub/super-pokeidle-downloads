// Keep the displayed version in sync with the official update channel.
// The download always follows GitHub's latest release, even if this request fails.
fetch('https://github.com/dnobre-hub/super-pokeidle-downloads/releases/latest/download/update.json', { signal: AbortSignal.timeout(6000) })
  .then(response => { if (!response.ok) throw new Error('Manifest unavailable'); return response.json() })
  .then(manifest => {
    if (!/^\d+\.\d+\.\d+$/.test(manifest.version)) return;
    document.querySelectorAll('[data-version]').forEach(element => { element.textContent = `V${manifest.version}` });
  })
  .catch(() => { /* The page and download remain available without the manifest. */ });

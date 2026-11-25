// Keep the displayed version in sync with the official update channel.
// The download always follows GitHub's latest release, even if this request fails.
fetch('https://github.com/dnobre-hub/super-pokeidle-downloads/releases/latest/download/update.json', { signal: AbortSignal.timeout(6000) })
  .then(response => { if (!response.ok) throw new Error('Manifest unavailable'); return response.json() })
  .then(manifest => {
    if (!/^\d+\.\d+\.\d+$/.test(manifest.version)) return;
    document.querySelectorAll('[data-version]').forEach(element => { element.textContent = `V${manifest.version}` });
  })
  .catch(() => { /* The page and download remain available without the manifest. */ });

const gallery = [...document.querySelectorAll('[data-gallery]')];
const viewer = document.querySelector('.screenshot-dialog');
if (viewer && typeof viewer.showModal === 'function') {
  let current = 0;
  let trigger = null;
  const show = index => {
    current = (index + gallery.length) % gallery.length;
    const entry = gallery[current];
    const image = viewer.querySelector('.screenshot-full');
    image.src = entry.href;
    image.alt = entry.querySelector('img').alt;
    viewer.querySelector('#screenshot-title').textContent = entry.dataset.title;
    viewer.querySelector('.screenshot-counter').textContent = `${current + 1} / ${gallery.length}`;
  };
  gallery.forEach((entry, index) => entry.addEventListener('click', event => {
    event.preventDefault();
    trigger = entry;
    show(index);
    viewer.showModal();
  }));
  viewer.querySelector('.screenshot-close').addEventListener('click', () => viewer.close());
  viewer.querySelector('.screenshot-prev').addEventListener('click', () => show(current - 1));
  viewer.querySelector('.screenshot-next').addEventListener('click', () => show(current + 1));
  viewer.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      show(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  viewer.addEventListener('click', event => {
    const bounds = viewer.getBoundingClientRect();
    if (event.target === viewer && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) viewer.close();
  });
  viewer.addEventListener('close', () => trigger?.focus({ preventScroll: true }));
}

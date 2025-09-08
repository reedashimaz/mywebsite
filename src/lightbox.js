(function () {
    const SELECTOR_CONTAINER = '.experiences-section .exp-images';
    const SELECTOR_THUMBS = `${SELECTOR_CONTAINER} img`;
  
    const overlay = document.createElement('div');
    overlay.className = 'lb-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML = `
      <div class="lb-stage">
        <img class="lb-img" alt="" />
        <button class="lb-close" aria-label="Close">✕</button>
        <button class="lb-prev" aria-label="Previous">‹</button>
        <button class="lb-next" aria-label="Next">›</button>
        <div class="lb-counter" aria-live="polite"></div>
      </div>
    `;
    document.body.appendChild(overlay);
  
    let imgEl = overlay.querySelector('.lb-img');
    const btnClose = overlay.querySelector('.lb-close');
    const btnPrev = overlay.querySelector('.lb-prev');
    const btnNext = overlay.querySelector('.lb-next');
    const counterEl = overlay.querySelector('.lb-counter');
  
    let albums = [];
    let currentAlbumIndex = 0;
    let currentIndex = 0;
    let suppressDocClick = false;
  
    function collectAlbums() {
      albums = [];
      document.querySelectorAll(SELECTOR_CONTAINER).forEach(container => {
        const sources = Array.from(container.querySelectorAll('img')).map(img => img.dataset.full || img.src);
        const albumIdx = albums.push({ container, images: sources }) - 1;
        container.querySelectorAll('img').forEach((img, idx) => {
          img.dataset.lbAlbum = albumIdx;
          img.dataset.lbIndex = idx;
          img.style.cursor = 'zoom-in';
        });
      });
    }
  
    function openLightbox(albumIdx, imageIdx) {
      if (!albums[albumIdx]) return;
      currentAlbumIndex = albumIdx;
      currentIndex = imageIdx;
      updateImage(true);
      overlay.classList.add('lb-open');
      document.body.classList.add('lb-no-scroll');
    }
  
    function closeLightbox() {
      overlay.classList.remove('lb-open');
      document.body.classList.remove('lb-no-scroll');
    }
  
    function updateImage(forceReplace = false) {
      const album = albums[currentAlbumIndex];
      if (!album) return;
      const stage = overlay.querySelector('.lb-stage');
      const src = album.images[currentIndex];
      const newImg = new Image();
      newImg.className = 'lb-img';
      newImg.alt = album.container.querySelectorAll('img')[currentIndex]?.alt || '';
      newImg.onload = () => {
        stage.replaceChild(newImg, imgEl);
        imgEl = newImg;
      };
      newImg.src = src;
      counterEl.textContent = `${currentIndex + 1} / ${album.images.length}`;
      const p = new Image();
      p.src = album.images[(currentIndex - 1 + album.images.length) % album.images.length];
      const n = new Image();
      n.src = album.images[(currentIndex + 1) % album.images.length];
      if (!forceReplace) {}
    }
  
    function nextImage() {
      const album = albums[currentAlbumIndex];
      currentIndex = (currentIndex + 1) % album.images.length;
      updateImage();
    }
  
    function prevImage() {
      const album = albums[currentAlbumIndex];
      currentIndex = (currentIndex - 1 + album.images.length) % album.images.length;
      updateImage();
    }
  
    document.addEventListener('click', (e) => {
      if (suppressDocClick) return;
      const thumb = e.target.closest(SELECTOR_THUMBS);
      if (!thumb) return;
      e.preventDefault();
      if (!albums.length) collectAlbums();
      const albumIdx = Number(thumb.dataset.lbAlbum ?? 0);
      const idx = Number(thumb.dataset.lbIndex ?? 0);
      openLightbox(albumIdx, idx);
    });
  
    btnClose.addEventListener('click', (e) => {
      e.stopPropagation();
      closeLightbox();
      suppressDocClick = true;
      setTimeout(() => { suppressDocClick = false; }, 250);
    });
  
    btnNext.addEventListener('click', (e) => {
      e.stopPropagation();
      nextImage();
    });
  
    btnPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      prevImage();
    });
  
    overlay.addEventListener('click', (e) => {
      if (e.target.closest('.lb-prev, .lb-next, .lb-close')) return;
      const stage = overlay.querySelector('.lb-stage');
      if (!stage.contains(e.target)) {
        closeLightbox();
        suppressDocClick = true;
        setTimeout(() => { suppressDocClick = false; }, 250);
      }
    });
  
    window.addEventListener('keydown', (e) => {
      if (!overlay.classList.contains('lb-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    });
  
    let touchStartX = 0, touchEndX = 0;
    imgEl.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    imgEl.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].clientX;
      const dx = touchEndX - touchStartX;
      if (Math.abs(dx) > 40) { dx < 0 ? nextImage() : prevImage(); }
    }, { passive: true });
  
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', collectAlbums);
    } else {
      collectAlbums();
    }
  
    const mo = new MutationObserver(() => collectAlbums());
    mo.observe(document.body, { childList: true, subtree: true });
  })();  
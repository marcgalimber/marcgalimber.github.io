// Disable image dragging
document.addEventListener('DOMContentLoaded', () => {
  // Prevent dragging images
  document.querySelectorAll('img').forEach(img => {
    img.setAttribute('draggable', 'false');
  });

  // Build the image list from DOM
  buildImageList();

  // Set up click listeners on gallery items
  document.querySelectorAll('.photosub-item, .photo-item').forEach((item) => {
    item.addEventListener('click', function () {
      const img = this.querySelector('img');
      openLightbox(img);
    });
  });

  // Load navbar
  const lang = document.documentElement.lang || 'en';
  loadNavbar(lang);
  loadFooter(lang);
});

// Prevent right-click on images
document.addEventListener('contextmenu', function (e) {
  const isImage = e.target.tagName === 'IMG';
  const isProtected = e.target.closest('.image-protect-wrapper');
  if (isImage || isProtected) {
    e.preventDefault();
  }
});

// Dynamically populated image list
let images = [];
let currentIndex = 0;

function buildImageList() {
  const imgNodes = document.querySelectorAll('.photosub-gallery img');
  images = Array.from(imgNodes).map(img => ({
    src: img.getAttribute('src'),
    caption: img.dataset.caption || ''
  }));
}

// Lightbox functions
function openLightbox(imgElement) {
  const src = imgElement.getAttribute('src');
  const caption = imgElement.dataset.caption || '';
  currentIndex = images.findIndex(img => img.src === src);

  document.getElementById('lightbox-img').src = src;
  document.getElementById('lightbox-caption').textContent = caption;
  document.getElementById('lightbox').classList.add('show');
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('show');
}

function showNext() {
  currentIndex = (currentIndex + 1) % images.length;
  const img = images[currentIndex];
  document.getElementById('lightbox-img').src = img.src;
  document.getElementById('lightbox-caption').textContent = img.caption;
}

function showPrev() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  const img = images[currentIndex];
  document.getElementById('lightbox-img').src = img.src;
  document.getElementById('lightbox-caption').textContent = img.caption;
}

// Keyboard navigation
document.addEventListener('keydown', function (e) {
  const lightboxVisible = document.getElementById('lightbox')?.classList.contains('show');
  if (!lightboxVisible) return;

  if (e.key === 'ArrowRight') showNext();
  else if (e.key === 'ArrowLeft') showPrev();
  else if (e.key === 'Escape') closeLightbox();
});

// Load navbar and attach mobile toggle
function loadNavbar(language = 'en') {
  const file = language === 'it' ? 'navbar_it.html' : language === 'fr' ? 'navbar_fr.html' : 'navbar.html';

fetch('/' + file)
    .then(response => {
      if (!response.ok) throw new Error(`Failed to load ${file}`);
      return response.text();
    })
    .then(html => {
      const container = document.getElementById('navbar-placeholder');
      if (!container) return;

      container.innerHTML = html;

      // Reattach mobile menu functionality
      const menu = document.querySelector('#mobile-menu');
      const menuLinks = document.querySelector('.navbar__menu');

      if (menu && menuLinks) {
        menu.addEventListener('click', () => {
          menu.classList.toggle('is-active');
          menuLinks.classList.toggle('active');
        });
      }
    })
    .catch(err => console.error('Navbar load error:', err));
}

// Language switching
function switchLanguage(targetLang) {
  let currentPage = window.location.pathname.split('/').pop();

  // Fallback if currentPage is empty
  if (!currentPage || currentPage === '') {
    currentPage = 'index.html';
  }

  // Rimuove eventuali suffissi di lingua esistenti
  currentPage = currentPage.replace(/_(it|en|fr)\.html$/, '.html');

  // Costruisci il nuovo nome del file in base alla lingua target
  let newPage;
  if (targetLang === 'en') {
    newPage = currentPage.replace('.html', '.html'); // Niente suffisso per inglese o puoi lasciarlo
  } else {
    newPage = currentPage.replace('.html', `_${targetLang}.html`);
  }

  // Reindirizza alla nuova pagina
  window.location.href = newPage;
}

// Language switch buttons
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('lang-en')) {
    e.preventDefault();
    switchLanguage('en');
  } else if (e.target.classList.contains('lang-it')) {
    e.preventDefault();
    switchLanguage('it');
  } else if (e.target.classList.contains('lang-fr')) { // Added French language button handler
    e.preventDefault();
    switchLanguage('fr');
  }
});


//footer
function loadFooter(language = 'en') {
  const footers = {
    en: `© <span id="year"></span> Marco Galimberti. All rights reserved.`,
    it: `© <span id="year"></span> Marco Galimberti. Tutti i diritti riservati.`,
    fr: `© <span id="year"></span> Marco Galimberti. Tous droits réservés.`
  };

  const footerHTML = `
    <footer class="site-footer">
      <p>${footers[language] || footers.en}</p>
    </footer>
  `;

  const footer = document.getElementById('footer-placeholder');
  if (!footer) return;

  footer.innerHTML = footerHTML;
  footer.querySelector('#year').textContent = new Date().getFullYear();
}

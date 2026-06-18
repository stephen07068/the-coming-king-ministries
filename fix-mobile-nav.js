/**
 * Fix mobile navbar across all public HTML pages.
 * Replaces the broken header with a fully responsive hamburger menu.
 */
const fs = require('fs');
const path = require('path');

const dir = __dirname;

const pages = [
  'about.html',
  'bible-school.html',
  'contact.html',
  'events.html',
  'gallery.html',
  'giving.html',
  'home_page_the_coming_king_ministries.html',
  'leadership.html',
  'sermons.html',
  'services.html',
];

// Determine active link per page
function getActiveLink(filename) {
  if (filename.includes('about')) return 'about.html';
  if (filename.includes('leadership')) return 'leadership.html';
  if (filename.includes('sermon')) return 'sermons.html';
  if (filename.includes('event')) return 'events.html';
  if (filename.includes('gallery')) return 'gallery.html';
  if (filename.includes('bible')) return 'bible-school.html';
  if (filename.includes('giving')) return 'giving.html';
  if (filename.includes('contact')) return 'contact.html';
  if (filename.includes('service')) return 'services.html';
  return 'home_page_the_coming_king_ministries.html';
}

function buildNavbar(activeFile) {
  const links = [
    { href: 'home_page_the_coming_king_ministries.html', label: 'Home' },
    { href: 'about.html', label: 'About' },
    { href: 'leadership.html', label: 'Leadership' },
    { href: 'sermons.html', label: 'Sermons' },
    { href: 'events.html', label: 'Events' },
    { href: 'gallery.html', label: 'Gallery' },
    { href: 'bible-school.html', label: 'Bible School' },
    { href: 'services.html', label: 'Services' },
  ];

  const desktopLinks = links.map(l => {
    const isActive = l.href === activeFile;
    const cls = isActive
      ? 'text-label-md text-primary border-b-2 border-primary pb-1'
      : 'text-label-md text-on-surface-variant hover:text-primary transition-colors';
    return `    <a class="${cls}" href="${l.href}">${l.label}</a>`;
  }).join('\n');

  const mobileLinks = links.map(l => {
    const isActive = l.href === activeFile;
    const cls = isActive
      ? 'block px-4 py-3 text-primary font-bold border-l-4 border-primary bg-primary/5 rounded-r-lg'
      : 'block px-4 py-3 text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors rounded-lg';
    return `      <a class="${cls}" href="${l.href}" onclick="closeMobileMenu()">${l.label}</a>`;
  }).join('\n');

  return `<!-- TopNavBar -->
<header class="fixed top-0 w-full z-50 bg-white border-b border-surface-container-high shadow-sm">
  <div class="flex justify-between items-center px-4 md:px-margin-desktop h-16 md:h-20 max-w-[1440px] mx-auto">

    <!-- Logo -->
    <a href="home_page_the_coming_king_ministries.html" class="flex items-center gap-3 flex-shrink-0">
      <img src="IMG_7893.PNG" alt="The Coming King Ministries Logo" class="h-10 w-10 md:h-12 md:w-12 object-contain rounded-full" loading="eager" fetchpriority="high"/>
      <span class="text-sm md:text-headline-sm font-bold text-primary tracking-tight leading-tight">
        <span class="hidden sm:inline">The Coming King Ministries</span>
        <span class="sm:hidden">TCKM</span>
      </span>
    </a>

    <!-- Desktop Nav -->
    <nav class="hidden md:flex items-center gap-6 lg:gap-8">
${desktopLinks}
    </nav>

    <!-- Desktop CTA Buttons -->
    <div class="hidden md:flex items-center gap-3">
      <a href="giving.html" class="px-5 py-2 rounded-lg bg-primary text-white text-label-md hover:opacity-90 transition-all shadow-sm">Giving</a>
      <a href="contact.html" class="px-5 py-2 rounded-lg border border-primary text-primary text-label-md hover:bg-primary hover:text-white transition-all">Contact</a>
    </div>

    <!-- Mobile Hamburger Button -->
    <button id="mobile-menu-btn" onclick="toggleMobileMenu()" aria-label="Open menu" class="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-surface-container transition-colors">
      <span id="ham-line-1" class="block w-6 h-0.5 bg-on-background transition-all duration-300"></span>
      <span id="ham-line-2" class="block w-6 h-0.5 bg-on-background transition-all duration-300"></span>
      <span id="ham-line-3" class="block w-4 h-0.5 bg-on-background transition-all duration-300"></span>
    </button>
  </div>

  <!-- Mobile Drawer Menu -->
  <div id="mobile-menu" class="md:hidden fixed inset-0 z-40 pointer-events-none">
    <!-- Backdrop -->
    <div id="mobile-backdrop" onclick="closeMobileMenu()" class="absolute inset-0 bg-black/50 opacity-0 transition-opacity duration-300"></div>
    <!-- Slide-in panel -->
    <div id="mobile-panel" class="absolute top-0 right-0 h-full w-72 bg-white shadow-2xl transform translate-x-full transition-transform duration-300 ease-in-out overflow-y-auto">
      <div class="flex items-center justify-between p-4 border-b border-surface-container">
        <span class="font-bold text-primary text-sm">Menu</span>
        <button onclick="closeMobileMenu()" class="p-2 rounded-lg hover:bg-surface-container transition-colors" aria-label="Close menu">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <nav class="p-4 space-y-1">
${mobileLinks}
      </nav>
      <div class="p-4 border-t border-surface-container space-y-3 mt-4">
        <a href="giving.html" class="block w-full text-center px-6 py-3 rounded-lg bg-primary text-white font-bold text-sm hover:opacity-90 transition-all shadow-sm">💝 Give Online</a>
        <a href="contact.html" class="block w-full text-center px-6 py-3 rounded-lg border-2 border-primary text-primary font-bold text-sm hover:bg-primary hover:text-white transition-all">📞 Contact Us</a>
      </div>
    </div>
  </div>
</header>

<script>
  function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const panel = document.getElementById('mobile-panel');
    const backdrop = document.getElementById('mobile-backdrop');
    const l1 = document.getElementById('ham-line-1');
    const l2 = document.getElementById('ham-line-2');
    const l3 = document.getElementById('ham-line-3');
    const isOpen = panel.classList.contains('translate-x-0');
    if (isOpen) {
      closeMobileMenu();
    } else {
      menu.style.pointerEvents = 'all';
      backdrop.classList.remove('opacity-0');
      panel.classList.remove('translate-x-full');
      panel.classList.add('translate-x-0');
      l1.style.transform = 'rotate(45deg) translate(5px, 5px)';
      l2.style.opacity = '0';
      l3.style.transform = 'rotate(-45deg) translate(3px, -3px)';
      l3.style.width = '24px';
      document.body.style.overflow = 'hidden';
    }
  }
  function closeMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const panel = document.getElementById('mobile-panel');
    const backdrop = document.getElementById('mobile-backdrop');
    const l1 = document.getElementById('ham-line-1');
    const l2 = document.getElementById('ham-line-2');
    const l3 = document.getElementById('ham-line-3');
    backdrop.classList.add('opacity-0');
    panel.classList.add('translate-x-full');
    panel.classList.remove('translate-x-0');
    l1.style.transform = '';
    l2.style.opacity = '';
    l3.style.transform = '';
    l3.style.width = '';
    document.body.style.overflow = '';
    setTimeout(() => { menu.style.pointerEvents = 'none'; }, 300);
  }
  // Close on ESC key
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMobileMenu(); });
</script>`;
}

// Regex to match the existing header block (from <header to </header>)
const headerRegex = /<header[\s\S]*?<\/header>/;

let fixed = 0;
for (const filename of pages) {
  const filePath = path.join(dir, filename);
  if (!fs.existsSync(filePath)) { console.log(`⏩ Not found: ${filename}`); continue; }

  let html = fs.readFileSync(filePath, 'utf8');
  const activeFile = getActiveLink(filename);
  const newNavbar = buildNavbar(activeFile);

  if (headerRegex.test(html)) {
    html = html.replace(headerRegex, newNavbar);
    // Fix pt-20 to pt-16 md:pt-20 for correct header offset
    html = html.replace(/class="pt-20"/g, 'class="pt-16 md:pt-20"');
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`✅ Fixed navbar: ${filename}`);
    fixed++;
  } else {
    console.log(`⚠️  No navbar found: ${filename}`);
  }
}

console.log(`\n✅ Done! Fixed mobile navbar on ${fixed} pages.`);

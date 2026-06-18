const fs = require('fs');

const pages = [
  'about.html', 'bible-school.html', 'contact.html', 'events.html',
  'gallery.html', 'giving.html', 'home_page_the_coming_king_ministries.html',
  'leadership.html', 'sermons.html', 'services.html'
];

let count = 0;
pages.forEach(f => {
  if (!fs.existsSync(f)) return;
  let html = fs.readFileSync(f, 'utf8');
  const before = html;

  // Remove Admin Portal div
  html = html.replace(/<div class="text-center py-3 border-t border-white\/5"><a href="admin-super\.html"[^<]*>Admin Portal<\/a><\/div>/g, '');
  // Remove Admin Login div
  html = html.replace(/<div class="border-t border-white\/10 mt-6 pt-4 text-center"><a href="admin-login\.html"[^<]*>Admin Login<\/a><\/div>/g, '');

  if (html !== before) {
    fs.writeFileSync(f, html, 'utf8');
    console.log('✅ Cleaned: ' + f);
    count++;
  } else {
    console.log('⏩ No match: ' + f);
  }
});

console.log('\nDone! ' + count + ' pages cleaned.');

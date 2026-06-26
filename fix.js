const fs = require('fs');
const files = ['home_page_the_coming_king_ministries.html','about.html','leadership.html','sermons.html','events.html','gallery.html','bible-school.html','children.html','services.html','giving.html','contact.html', 'admin-content.html', 'admin-media.html', 'admin-super.html', 'admin-login.html'];
files.forEach(f => {
  if (fs.existsSync(f)) {
    let txt = fs.readFileSync(f, 'utf8');
    txt = txt.replace(/â€”/g, '-');
    txt = txt.replace(/â€“/g, '-');
    txt = txt.replace(/â€¢/g, '&bull;');
    txt = txt.replace(/ðŸ’\x9D/g, ''); // give online
    txt = txt.replace(/ðŸ“ž/g, ''); // contact us
    txt = txt.replace(/Â©/g, '&copy;');
    fs.writeFileSync(f, txt, 'utf8');
  }
});
console.log('Fixed files successfully!');

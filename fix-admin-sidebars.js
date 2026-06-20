const fs = require('fs');

function fixAdminSidebars() {
  // 1. Fix admin-super.html
  let superHtml = fs.readFileSync('admin-super.html', 'utf8');
  // Find the button and replace with a working logout button
  superHtml = superHtml.replace(
    /<button class="p-1\.5 text-on-surface-variant hover:text-primary"><span class="material-symbols-outlined text-\[20px\]">logout<\/span><\/button>/g,
    `<button onclick="sessionStorage.clear(); window.location.href='admin/index.html';" class="p-1.5 text-on-surface-variant hover:text-primary" title="Logout"><span class="material-symbols-outlined text-[20px]">logout</span></button>`
  );
  fs.writeFileSync('admin-super.html', superHtml);

  // 2. Fix admin-content.html
  let contentHtml = fs.readFileSync('admin-content.html', 'utf8');
  // Find the paragraph at the end of the sidebar and add the logout button
  contentHtml = contentHtml.replace(
    /<\/p>\s*<\/div>\s*<\/aside>/g,
    `</p>\n    <button onclick="sessionStorage.clear(); window.location.href='admin/index.html';" class="w-full flex items-center justify-center gap-2 mt-3 py-1.5 border border-outline-variant rounded-lg text-[11px] text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all" title="Logout"><span class="material-symbols-outlined text-[16px]">logout</span> Logout</button>\n  </div>\n</aside>`
  );
  fs.writeFileSync('admin-content.html', contentHtml);

  // 3. Fix admin-media.html
  let mediaHtml = fs.readFileSync('admin-media.html', 'utf8');
  // Find the flex gap-2 mt-3 container with the links, replace with logout button
  mediaHtml = mediaHtml.replace(
    /<div class="flex gap-2 mt-3">[\s\S]*?<\/div>\s*<\/div>\s*<\/aside>/g,
    `<button onclick="sessionStorage.clear(); window.location.href='admin/index.html';" class="w-full flex items-center justify-center gap-2 mt-3 py-1.5 border border-outline-variant rounded-lg text-[11px] text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all" title="Logout"><span class="material-symbols-outlined text-[16px]">logout</span> Logout</button>\n  </div>\n</aside>`
  );
  fs.writeFileSync('admin-media.html', mediaHtml);
}

fixAdminSidebars();

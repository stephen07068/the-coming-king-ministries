const fs = require('fs');

let content = fs.readFileSync('about.html', 'utf8');

const targetStr = `<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
        <div class="overflow-hidden rounded-t-xl" style="height:320px;"><img style="width:100%;height:100%;object-fit:cover;object-position:center 15%;" src="IMG-20260616-WA0032.jpg" alt="Abeokuta Area - Pastor Okewale A. Isaiah"/ loading="lazy"></div>
  <div class="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-gutter-desktop">`;

const replacement = `<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
        <div class="overflow-hidden rounded-t-xl" style="height:320px;"><img style="width:100%;height:100%;object-fit:cover;object-position:center 15%;" src="IMG-20260616-WA0032.jpg" alt="Abeokuta Area - Pastor Okewale A. Isaiah" loading="lazy"></div>
        <div class="p-6">
          <div class="flex items-center gap-2 mb-3"><span class="material-symbols-outlined text-primary" style="font-variation-settings:'FILL' 1;">location_on</span><h3 class="text-headline-sm text-on-background">Abeokuta Area</h3></div>
          <p class="text-body-md text-on-surface-variant">Covering parishes in Abeokuta and its environs. Led by Pastor Okewale A. Isaiah as Area Pastor.</p>
        </div>
      </div>
      <div class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
        <div class="overflow-hidden rounded-t-xl" style="height:320px;"><img style="width:100%;height:100%;object-fit:cover;object-position:center 20%;" src="1781947300578.jpg" alt="Ijebu Area - Pastor Samuel O. Olatoye" loading="lazy"></div>
        <div class="p-6">
          <div class="flex items-center gap-2 mb-3"><span class="material-symbols-outlined text-primary" style="font-variation-settings:'FILL' 1;">location_on</span><h3 class="text-headline-sm text-on-background">Ijebu Area</h3></div>
          <p class="text-body-md text-on-surface-variant">Covering parishes in Ijebu Igbo and its environs. Led by Pastor Samuel O. Olatoye as Ijebu Area Pastor.</p>
        </div>
      </div>
      <div class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
        <div class="overflow-hidden rounded-t-xl" style="height:320px;"><img style="width:100%;height:100%;object-fit:cover;object-position:center 20%;" src="1785264340181.png" alt="Ibadan Area - Pastor Samuel Olorundare" loading="lazy"></div>
        <div class="p-6">
          <div class="flex items-center gap-2 mb-3"><span class="material-symbols-outlined text-primary" style="font-variation-settings:'FILL' 1;">location_on</span><h3 class="text-headline-sm text-on-background">Ibadan Area</h3></div>
          <p class="text-body-md text-on-surface-variant">Covering parishes in Ibadan and its environs. Led by Pastor Samuel Olorundare.</p>
        </div>
      </div>
    </div>
  </div>
</section>

</main>

<footer class="w-full py-16 px-margin-desktop bg-secondary text-white">
  <div class="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-gutter-desktop">`;

content = content.replace(targetStr, replacement);
fs.writeFileSync('about.html', content, 'utf8');
console.log('REPLACED PERFECTLY!');

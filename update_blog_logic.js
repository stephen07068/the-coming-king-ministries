const fs = require('fs');

function updateBlogHandling(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace publishContent with blog support
  const oldPublish = `    try {
      if (type === 'sermon-video' || type === 'sermon-audio') {
        const link = document.getElementById('sermon-link').value.trim();
        await addDoc(collection(db, 'video_sermons'), {
          title,
          speaker,
          link,
          type: type === 'sermon-video' ? 'video' : 'audio',
          description,
          createdAt: serverTimestamp()
        });
        if (inputs[0]) inputs[0].value = '';
        if (inputs[1]) inputs[1].value = '';
        document.getElementById('sermon-link').value = '';
        document.querySelector('#modal textarea').value = '';
        closeModal();
        await loadSermons();
        alert('✅ "' + title + '" published successfully!');
      } else {
        // Bible school lesson - read image as base64
        const fileInput = document.getElementById('bible-img');
        let imageUrl = '';
        if (fileInput.files.length) {
          imageUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(fileInput.files[0]);
          });
        }
        const week = description || '';
        await addDoc(collection(db, 'bible_school'), {
          title,
          teacher: speaker,
          description,
          imageUrl,
          week,
          createdAt: serverTimestamp()
        });
        if (inputs[0]) inputs[0].value = '';
        if (inputs[1]) inputs[1].value = '';
        if (fileInput) fileInput.value = '';
        document.querySelector('#modal textarea').value = '';
        closeModal();
        await loadBibleLessons();
        alert('✅ "' + title + '" published successfully!');
      }
    } catch (e) {`;

  const newPublish = `    try {
      if (type === 'sermon-video' || type === 'sermon-audio') {
        const link = document.getElementById('sermon-link').value.trim();
        await addDoc(collection(db, 'video_sermons'), {
          title,
          speaker,
          link,
          type: type === 'sermon-video' ? 'video' : 'audio',
          description,
          createdAt: serverTimestamp()
        });
        if (inputs[0]) inputs[0].value = '';
        if (inputs[1]) inputs[1].value = '';
        document.getElementById('sermon-link').value = '';
        document.querySelector('#modal textarea').value = '';
        closeModal();
        await loadSermons();
        alert('✅ "' + title + '" published successfully!');
      } else if (type === 'blog') {
        const fileInput = document.getElementById('bible-img');
        let imageUrl = '';
        if (fileInput && fileInput.files.length) {
          imageUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(fileInput.files[0]);
          });
        }
        await addDoc(collection(db, 'blog_posts'), {
          title,
          author: speaker || 'Ministry',
          content: description,
          imageUrl,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          createdAt: serverTimestamp()
        });
        if (inputs[0]) inputs[0].value = '';
        if (inputs[1]) inputs[1].value = '';
        if (fileInput) fileInput.value = '';
        document.querySelector('#modal textarea').value = '';
        closeModal();
        if (typeof loadBlogList === 'function') await loadBlogList();
        alert('✅ Blog post "' + title + '" published successfully!');
      } else {
        // Bible school lesson - read image as base64
        const fileInput = document.getElementById('bible-img');
        let imageUrl = '';
        if (fileInput.files.length) {
          imageUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(fileInput.files[0]);
          });
        }
        const week = description || '';
        await addDoc(collection(db, 'bible_school'), {
          title,
          teacher: speaker,
          description,
          imageUrl,
          week,
          createdAt: serverTimestamp()
        });
        if (inputs[0]) inputs[0].value = '';
        if (inputs[1]) inputs[1].value = '';
        if (fileInput) fileInput.value = '';
        document.querySelector('#modal textarea').value = '';
        closeModal();
        await loadBibleLessons();
        alert('✅ "' + title + '" published successfully!');
      }
    } catch (e) {`;

  if (content.includes(oldPublish)) {
    content = content.replace(oldPublish, newPublish);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated publishContent in ${filePath}`);
  }
}

updateBlogHandling('admin-content.html');
updateBlogHandling('admin/content.html');

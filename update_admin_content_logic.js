const fs = require('fs');

function updateAdminContentLogic(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace deleteBibleLesson function
  const oldDeleteBibleLesson = `  // ── Delete Bible Lesson ──
  window.deleteBibleLesson = async function(id, btn) {
    if (!confirm('Delete this lesson? This cannot be undone.')) return;
    try {
      await deleteDoc(doc(db, 'bible_school', id));
      const row = btn.closest('tr');
      if (row) { row.style.transition = 'opacity 0.3s'; row.style.opacity = '0'; setTimeout(() => row.remove(), 300); }
    } catch (e) {
      console.error('deleteBibleLesson error:', e);
      alert('Failed to delete lesson.');
    }
  };`;

  const newDeleteBibleLesson = `  // ── Delete Bible Lesson ──
  window.deleteBibleLesson = async function(id, btn) {
    if (!confirm('Delete this lesson? This cannot be undone.')) return;
    if (btn) btn.disabled = true;
    try {
      await deleteDoc(doc(db, 'bible_school', id));
      await loadBibleLessons();
    } catch (e) {
      console.error('deleteBibleLesson error:', e);
      alert('Failed to delete lesson: ' + (e.message || e));
      if (btn) btn.disabled = false;
    }
  };`;

  if (content.includes(oldDeleteBibleLesson)) {
    content = content.replace(oldDeleteBibleLesson, newDeleteBibleLesson);
  }

  // Replace publishContent function
  const oldPublishContent = `  // ── Publish Content ──
  window.publishContent = async function() {
    const type = document.getElementById('content-type-select').value;
    const inputs = document.querySelectorAll('#modal input[type="text"]');
    const title = inputs[0] ? inputs[0].value.trim() : '';
    const speaker = inputs[1] ? inputs[1].value.trim() : '';
    const description = document.querySelector('#modal textarea').value.trim();

    if (!title) { alert('Please enter a title.'); return; }

    try {
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
        closeModal();
        await loadBibleLessons();
        alert('✅ "' + title + '" published successfully!');
      }
    } catch (e) {
      console.error('publishContent error:', e);
      alert('Failed to publish content. Check console for details.');
    }
  };`;

  const newPublishContent = `  // ── Publish Content ──
  window.publishContent = async function() {
    const pubBtn = document.getElementById('publish-btn');
    const type = document.getElementById('content-type-select').value;
    const inputs = document.querySelectorAll('#modal input[type="text"]');
    const title = inputs[0] ? inputs[0].value.trim() : '';
    const speaker = inputs[1] ? inputs[1].value.trim() : '';
    const description = document.querySelector('#modal textarea').value.trim();

    if (!title) { alert('Please enter a title.'); return; }

    if (pubBtn) {
      pubBtn.disabled = true;
      pubBtn.innerHTML = '<span class="material-symbols-outlined text-[16px] animate-spin">progress_activity</span> Publishing...';
    }

    try {
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
    } catch (e) {
      console.error('publishContent error:', e);
      alert('Failed to publish content. ' + (e.message || e));
    } finally {
      if (pubBtn) {
        pubBtn.disabled = false;
        pubBtn.innerHTML = 'Publish Now';
      }
    }
  };`;

  if (content.includes(oldPublishContent)) {
    content = content.replace(oldPublishContent, newPublishContent);
  }

  // Replace publishQuiz function
  const oldPublishQuiz = `  window.publishQuiz = async function(collectionName, prefix) {
    const title = document.getElementById(prefix + '-title').value.trim();
    if (!title) { alert('Please enter a quiz title.'); return; }
    
    const questions = [];
    const container = document.getElementById(prefix + '-questions-container');
    const qDivs = container.querySelectorAll('[id^="' + prefix + '-q"]');
    
    for (const div of qDivs) {
      const id = div.id;
      const idx = id.replace(prefix + '-q', '');
      const qText = document.getElementById(prefix + '-q' + idx + '-text');
      if (!qText) continue;
      const question = qText.value.trim();
      const optA = document.getElementById(prefix + '-q' + idx + '-a').value.trim();
      const optB = document.getElementById(prefix + '-q' + idx + '-b').value.trim();
      const optC = document.getElementById(prefix + '-q' + idx + '-c').value.trim();
      const optD = document.getElementById(prefix + '-q' + idx + '-d').value.trim();
      const correct = parseInt(document.getElementById(prefix + '-q' + idx + '-correct').value);
      
      if (!question || !optA || !optB || !optC || !optD) { alert('Please fill in all fields for each question.'); return; }
      questions.push({ question, options: [optA, optB, optC, optD], correctAnswer: correct });
    }
    
    if (questions.length < 3) { alert('Please add at least 3 questions.'); return; }
    if (questions.length > 5) { alert('Maximum 5 questions allowed.'); return; }
    
    try {
      await addDoc(collection(db, collectionName), {
        title: title,
        questions: questions,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        createdAt: serverTimestamp()
      });
      alert('Quiz published successfully!');
      document.getElementById(prefix + '-title').value = '';
      document.getElementById(prefix + '-questions-container').innerHTML = '';
      window.quizCounters = window.quizCounters || {};
      window.quizCounters[prefix] = 0;
      loadQuizList(collectionName, prefix);
    } catch (err) {
      alert('Error publishing quiz: ' + err.message);
    }
  };`;

  const newPublishQuiz = `  window.publishQuiz = async function(collectionName, prefix, btn) {
    const pubBtn = btn || document.getElementById(prefix + '-pub-btn');
    const title = document.getElementById(prefix + '-title').value.trim();
    if (!title) { alert('Please enter a quiz title.'); return; }
    
    const questions = [];
    const container = document.getElementById(prefix + '-questions-container');
    const qDivs = container.querySelectorAll('[id^="' + prefix + '-q"]');
    
    for (const div of qDivs) {
      const id = div.id;
      const idx = id.replace(prefix + '-q', '');
      const qText = document.getElementById(prefix + '-q' + idx + '-text');
      if (!qText) continue;
      const question = qText.value.trim();
      const optA = document.getElementById(prefix + '-q' + idx + '-a').value.trim();
      const optB = document.getElementById(prefix + '-q' + idx + '-b').value.trim();
      const optC = document.getElementById(prefix + '-q' + idx + '-c').value.trim();
      const optD = document.getElementById(prefix + '-q' + idx + '-d').value.trim();
      const correct = parseInt(document.getElementById(prefix + '-q' + idx + '-correct').value);
      
      if (!question || !optA || !optB || !optC || !optD) { alert('Please fill in all fields for each question.'); return; }
      questions.push({ question, options: [optA, optB, optC, optD], correctAnswer: correct });
    }
    
    if (questions.length < 3) { alert('Please add at least 3 questions.'); return; }
    if (questions.length > 5) { alert('Maximum 5 questions allowed.'); return; }

    if (pubBtn) {
      pubBtn.disabled = true;
      pubBtn.innerHTML = '<span class="material-symbols-outlined text-[18px] animate-spin">progress_activity</span> Publishing...';
    }

    try {
      await addDoc(collection(db, collectionName), {
        title: title,
        questions: questions,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        createdAt: serverTimestamp()
      });
      alert('✅ Quiz published successfully!');
      document.getElementById(prefix + '-title').value = '';
      document.getElementById(prefix + '-questions-container').innerHTML = '';
      window.quizCounters = window.quizCounters || {};
      window.quizCounters[prefix] = 0;
      await loadQuizList(collectionName, prefix);
    } catch (err) {
      console.error('publishQuiz error:', err);
      alert('Error publishing quiz: ' + err.message);
    } finally {
      if (pubBtn) {
        pubBtn.disabled = false;
        pubBtn.innerHTML = '<span class="material-symbols-outlined text-[18px]">publish</span> Publish Quiz';
      }
    }
  };`;

  if (content.includes(oldPublishQuiz)) {
    content = content.replace(oldPublishQuiz, newPublishQuiz);
  }

  // Replace deleteQuiz function
  const oldDeleteQuiz = `  window.deleteQuiz = async function(collectionName, docId, prefix) {
    if (!confirm('Are you sure you want to delete this quiz?')) return;
    try {
      await deleteDoc(doc(db, collectionName, docId));
      loadQuizList(collectionName, prefix);
    } catch (err) {
      alert('Error deleting: ' + err.message);
    }
  };`;

  const newDeleteQuiz = `  window.deleteQuiz = async function(collectionName, docId, prefix) {
    if (!confirm('Are you sure you want to delete this quiz? This cannot be undone.')) return;
    try {
      await deleteDoc(doc(db, collectionName, docId));
      await loadQuizList(collectionName, prefix);
    } catch (err) {
      console.error('deleteQuiz error:', err);
      alert('Error deleting quiz: ' + err.message);
    }
  };`;

  if (content.includes(oldDeleteQuiz)) {
    content = content.replace(oldDeleteQuiz, newDeleteQuiz);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated admin content logic in ${filePath}`);
}

updateAdminContentLogic('admin-content.html');
updateAdminContentLogic('admin/content.html');

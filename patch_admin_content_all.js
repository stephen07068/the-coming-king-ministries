const fs = require('fs');

const completeScriptBlock = `  // Delete Sermon
  window.deleteSermon = async function(id, btn) {
    if (!confirm('Delete this sermon? This cannot be undone.')) return;
    if (btn) btn.disabled = true;
    try {
      await deleteDoc(doc(db, 'video_sermons', id));
      await loadSermons();
    } catch (e) {
      console.error('deleteSermon error:', e);
      alert('Failed to delete sermon: ' + (e.message || e));
      if (btn) btn.disabled = false;
    }
  };

  // Delete Bible Lesson
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
  };

  // Publish Content
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
        alert('✅ Sermon "' + title + '" published successfully!');
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
        alert('✅ Blog post "' + title + '" published successfully!');
      } else {
        // Bible school lesson - read image as base64
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
        alert('✅ Bible School Lesson "' + title + '" published successfully!');
      }
    } catch (e) {
      console.error('publishContent error:', e);
      alert('Failed to publish content: ' + (e.message || e));
    } finally {
      if (pubBtn) {
        pubBtn.disabled = false;
        pubBtn.innerHTML = 'Publish Now';
      }
    }
  };

  // ===== QUIZ FIREBASE FUNCTIONS =====
  window.publishQuiz = async function(collectionName, prefix, btn) {
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
  };

  async function loadQuizList(collectionName, prefix) {
    const listEl = document.getElementById(prefix + '-list');
    if (!listEl) return;
    try {
      const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      if (snap.empty) {
        listEl.innerHTML = '<p class="text-sm text-on-surface-variant text-center py-4">No quizzes published yet.</p>';
        return;
      }
      let html = '';
      snap.forEach(docSnap => {
        const d = docSnap.data();
        html += \`<div class="flex justify-between items-center p-3 border-b border-outline-variant/20 last:border-0">
          <div>
            <p class="text-sm font-semibold text-midnight-navy">\${d.title || ''}</p>
            <p class="text-[10px] text-on-surface-variant">\${d.date || 'No date'} &bull; \${d.questions ? d.questions.length : 0} questions</p>
          </div>
          <button onclick="deleteQuiz('\${collectionName}', '\${docSnap.id}', '\${prefix}', this)" class="text-xs text-red-500 hover:underline flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]">delete</span> Delete
          </button>
        </div>\`;
      });
      listEl.innerHTML = html;
    } catch (err) {
      console.error('loadQuizList error:', err);
      listEl.innerHTML = '<p class="text-sm text-red-500 text-center py-4">Error loading quizzes.</p>';
    }
  }

  window.deleteQuiz = async function(collectionName, docId, prefix, btn) {
    if (!confirm('Are you sure you want to delete this quiz? This cannot be undone.')) return;
    if (btn) btn.disabled = true;
    try {
      await deleteDoc(doc(db, collectionName, docId));
      await loadQuizList(collectionName, prefix);
    } catch (err) {
      console.error('deleteQuiz error:', err);
      alert('Error deleting quiz: ' + err.message);
      if (btn) btn.disabled = false;
    }
  };

  loadQuizList('children_quizzes', 'cq');
  loadQuizList('sunday_quizzes', 'sq');
`;

function patchAdminContentFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let fileContent = fs.readFileSync(filePath, 'utf8');

  const targetStr = "window.deleteSermon = async function";
  if (fileContent.includes(targetStr)) {
    const startIdx = fileContent.lastIndexOf("\n", fileContent.indexOf(targetStr));
    const endIdx = fileContent.indexOf("</script>", startIdx);
    if (startIdx !== -1 && endIdx !== -1) {
      fileContent = fileContent.substring(0, startIdx) + "\n" + completeScriptBlock + "\n" + fileContent.substring(endIdx);
      fs.writeFileSync(filePath, fileContent, 'utf8');
      console.log(`Patched ${filePath}`);
    }
  }
}

patchAdminContentFile('admin-content.html');
patchAdminContentFile('admin/content.html');

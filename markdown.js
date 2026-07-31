(function () {
  const target = document.querySelector('#about-content');
  if (!target) return;

  function escapeHtml(value) {
    return value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function inlineMarkdown(value) {
    return escapeHtml(value)
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');
  }

  function renderMarkdown(markdown) {
    const lines = markdown.replace(/\r/g, '').split('\n');
    const output = [];
    let paragraph = [];
    let listOpen = false;

    function closeParagraph() {
      if (!paragraph.length) return;
      output.push(`<p>${inlineMarkdown(paragraph.join(' '))}</p>`);
      paragraph = [];
    }

    function closeList() {
      if (!listOpen) return;
      output.push('</ul>');
      listOpen = false;
    }

    lines.forEach((line) => {
      const trimmed = line.trim();

      if (!trimmed) {
        closeParagraph();
        closeList();
      } else if (trimmed.startsWith('### ')) {
        closeParagraph(); closeList();
        output.push(`<h3>${inlineMarkdown(trimmed.slice(4))}</h3>`);
      } else if (trimmed.startsWith('## ')) {
        closeParagraph(); closeList();
        output.push(`<h2>${inlineMarkdown(trimmed.slice(3))}</h2>`);
      } else if (trimmed.startsWith('- ')) {
        closeParagraph();
        if (!listOpen) { output.push('<ul>'); listOpen = true; }
        output.push(`<li>${inlineMarkdown(trimmed.slice(2))}</li>`);
      } else {
        closeList();
        paragraph.push(trimmed);
      }
    });

    closeParagraph();
    closeList();
    return output.join('');
  }

  fetch('about.md')
    .then((response) => {
      if (!response.ok) throw new Error('Markdown introuvable');
      return response.text();
    })
    .then((markdown) => { target.innerHTML = renderMarkdown(markdown); })
    .catch(() => {
      target.innerHTML = '<p>La présentation est temporairement indisponible.</p>';
    });
})();

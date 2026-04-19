export interface ArticleHeading {
  id: string;
  text: string;
  level: number;
}

export function extractHeadings(content: string): ArticleHeading[] {
  // Normalize line endings and strip fenced code blocks before extracting headings
  const normalized = content.replace(/\r\n/g, '\n');
  const lines = normalized.split('\n');
  const textLines: string[] = [];
  let inCode = false;

  for (const line of lines) {
    if (!inCode && /^```\w*$/.test(line)) {
      inCode = true;
    } else if (inCode && /^```$/.test(line)) {
      inCode = false;
    } else if (!inCode) {
      textLines.push(line);
    }
  }

  const stripped = textLines.join('\n');
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: ArticleHeading[] = [];
  let match;

  while ((match = headingRegex.exec(stripped)) !== null) {
    const text = match[2].trim();
    const id = slugify(text);
    headings.push({ id, text, level: match[1].length });
  }

  return headings;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'heading'; // Fallback to avoid empty id
}

function renderTable(block: string): string {
  const rows = block.trim().split('\n');
  if (rows.length < 2) return block;

  // Check row 2 is a separator row like |------|------|
  const separatorRow = rows[1];
  if (!/^\|[\s:-]+(\|[\s:-]+)+\|?$/.test(separatorRow)) return block;

  const parseRow = (row: string) =>
    row.split('|').slice(1, -1).map((cell) => cell.trim());

  const headers = parseRow(rows[0]);
  const bodyRows = rows.slice(2);

  let html = '<table><thead><tr>';
  for (const h of headers) {
    html += `<th>${h}</th>`;
  }
  html += '</tr></thead><tbody>';
  for (const row of bodyRows) {
    const cells = parseRow(row);
    html += '<tr>';
    for (const cell of cells) {
      html += `<td>${cell}</td>`;
    }
    html += '</tr>';
  }
  html += '</tbody></table>';
  return html;
}

export function renderMarkdown(content: string): string {
  // Normalize line endings
  let html = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // ── Phase 1: Extract code blocks to protect them from inline transforms ──
  const codeBlocks: string[] = [];
  const lines = html.split('\n');
  const outputLines: string[] = [];
  let inCode = false;
  let codeLang = '';
  let codeBuf = '';

  for (const line of lines) {
    const openMatch = line.match(/^```(\w*)$/);
    if (!inCode && openMatch) {
      inCode = true;
      codeLang = openMatch[1] || '';
      codeBuf = '';
    } else if (inCode && /^```$/.test(line)) {
      const idx = codeBlocks.length;
      const langAttr = codeLang ? ` class="language-${codeLang}"` : '';
      const escaped = codeBuf.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      codeBlocks.push(
        `<div class="code-block-wrapper">
          <button class="copy-button" data-original-text="Copy">Copy</button>
          <pre><code${langAttr}>${escaped}</code></pre>
        </div>`
      );
      outputLines.push(`\x00CODE_BLOCK_${idx}\x00`);
      inCode = false;
    } else if (inCode) {
      codeBuf += line + '\n';
    } else {
      outputLines.push(line);
    }
  }

  html = outputLines.join('\n');

  // ── Phase 2: Tables ──
  html = html.replace(/(^\|.+\|$\n?){2,}/gm, (tableBlock) => {
    return renderTable(tableBlock);
  });

  // ── Phase 3: Block-level elements ──

  // Blockquotes (bold prefix variant)
  html = html.replace(/^>\s?\*\*(.+?)\*\*:\s*(.+)$/gm,
    '<blockquote><p><strong>$1:</strong> $2</p></blockquote>');
  // Blockquotes (standard)
  html = html.replace(/^>\s*(.+)$/gm, '<blockquote><p>$1</p></blockquote>');
  // Merge adjacent blockquotes
  html = html.replace(/<\/blockquote>\n<blockquote>/g, '\n');

  // Headings
  html = html.replace(/^### (.+)$/gm, (_, text) =>
    `<h3 id="${slugify(text)}">${text}</h3>`);
  html = html.replace(/^## (.+)$/gm, (_, text) =>
    `<h2 id="${slugify(text)}">${text}</h2>`);

  // Images → figure
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => {
    const safeAlt = String(alt).replace(/"/g, '&quot;');
    return `<figure class="article-figure"><img src="${src}" alt="${safeAlt}" loading="lazy" decoding="async"><figcaption>${alt}</figcaption></figure>`;
  });

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr>');

  // ── Phase 4: Inline elements ──
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // ── Phase 5: Lists ──

  // Unordered lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

  // Ordered lists
  html = html.replace(/^\d+\.\s(.+)$/gm, '<li>$1</li>');
  // Wrap consecutive <li> that aren't already wrapped in <ul>
  html = html.replace(/(?<!<\/ul>)(?:<li>.*<\/li>\n?)+/g, (match) => {
    // Only wrap if not already inside <ul>
    if (match.startsWith('<ul>')) return match;
    return `<ol>${match}</ol>`;
  });

  // ── Phase 6: Paragraphs ──
  // Wrap remaining plain-text lines in <p> tags
  html = html.replace(/^(?!<[a-z/]|\x00)((?!\s*$).+)$/gm, '<p>$1</p>');
  html = html.replace(/<p>\s*<\/p>/g, '');

  // ── Phase 7: Restore code blocks ──
  html = html.replace(/\x00CODE_BLOCK_(\d+)\x00/g, (_, idx) => codeBlocks[Number(idx)]);

  return html;
}

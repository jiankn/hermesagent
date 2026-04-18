export interface ArticleHeading {
  id: string;
  text: string;
  level: number;
}

export function extractHeadings(content: string): ArticleHeading[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: ArticleHeading[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const text = match[2].trim();
    const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    headings.push({ id, text, level: match[1].length });
  }

  return headings;
}

export function renderMarkdown(content: string): string {
  let html = content;

  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');
  html = html.replace(/^>\s?\*\*(.+?)\*\*:\s*(.+)$/gm, '<blockquote><p><strong>$1:</strong> $2</p></blockquote>');
  html = html.replace(/^>\s*(.+)$/gm, '<blockquote><p>$1</p></blockquote>');

  html = html.replace(/^### (.+)$/gm, (_, text) => {
    const id = text.trim().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    return `<h3 id="${id}">${text}</h3>`;
  });

  html = html.replace(/^## (.+)$/gm, (_, text) => {
    const id = text.trim().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    return `<h2 id="${id}">${text}</h2>`;
  });

  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => {
    const safeAlt = String(alt).replace(/"/g, '&quot;');
    return `<figure class="article-figure"><img src="${src}" alt="${safeAlt}" loading="lazy" decoding="async"><figcaption>${alt}</figcaption></figure>`;
  });
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
  html = html.replace(/^\d+\.\s(.+)$/gm, '<li>$1</li>');
  html = html.replace(/^---$/gm, '<hr>');
  html = html.replace(/^(?!<[a-z])((?!^\s*$).+)$/gm, '<p>$1</p>');
  html = html.replace(/<p>\s*<\/p>/g, '');

  return html;
}

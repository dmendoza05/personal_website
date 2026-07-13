function escapeHtml(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

function inlineMarkdown(text: string): string {
	return escapeHtml(text)
		.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
		.replace(/`([^`]+)`/g, '<code>$1</code>')
		.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

export function markdownToHtml(markdown: string): string {
	const lines = markdown.split('\n');
	const html: string[] = [];
	let inCodeBlock = false;
	let codeLines: string[] = [];
	let inList = false;

	const closeList = () => {
		if (inList) {
			html.push('</ul>');
			inList = false;
		}
	};

	for (const line of lines) {
		if (line.startsWith('```')) {
			if (inCodeBlock) {
				html.push(`<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
				codeLines = [];
				inCodeBlock = false;
			} else {
				closeList();
				inCodeBlock = true;
			}
			continue;
		}

		if (inCodeBlock) {
			codeLines.push(line);
			continue;
		}

		if (line.startsWith('### ')) {
			closeList();
			html.push(`<h3>${inlineMarkdown(line.slice(4))}</h3>`);
		} else if (line.startsWith('## ')) {
			closeList();
			html.push(`<h2>${inlineMarkdown(line.slice(3))}</h2>`);
		} else if (line.startsWith('# ')) {
			closeList();
			html.push(`<h1>${inlineMarkdown(line.slice(2))}</h1>`);
		} else if (line.startsWith('- ')) {
			if (!inList) {
				html.push('<ul>');
				inList = true;
			}
			html.push(`<li>${inlineMarkdown(line.slice(2))}</li>`);
		} else if (line.trim() === '') {
			closeList();
		} else {
			closeList();
			html.push(`<p>${inlineMarkdown(line)}</p>`);
		}
	}

	closeList();
	return html.join('\n');
}

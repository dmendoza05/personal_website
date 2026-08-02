/**
 * Generates an ATS-friendly resume PDF from resume.json + skill labels.
 * Run: `pnpm resume:pdf`
 *
 * Layout choices for ATS parsing:
 * - Single column, standard section headings
 * - Helvetica body text; no tables, multi-column layouts, or graphics
 * - Contact line as plain selectable text
 */
import { createWriteStream, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const PDFDocument = require('pdfkit');

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outPath = join(root, 'static', 'resume.pdf');
const resume = JSON.parse(readFileSync(join(root, 'src/lib/data/resume.json'), 'utf8'));
const skillsSrc = readFileSync(join(root, 'src/lib/data/skills.ts'), 'utf8');

const skillLabelById = new Map(
	[...skillsSrc.matchAll(/\{\s*id:\s*'([^']+)',\s*label:\s*'([^']+)'/g)].map((m) => [m[1], m[2]])
);

function skillLabels(ids) {
	return ids.map((id) => skillLabelById.get(id) ?? id);
}

/** Helvetica (WinAnsi) lacks en/em dashes; normalize for ATS-safe PDF text. */
function pdfText(value) {
	return String(value)
		.replace(/\u2013|\u2014/g, '-')
		.replace(/\u00b7|\u2022/g, '-')
		.replace(/\u2018|\u2019/g, "'")
		.replace(/\u201c|\u201d/g, '"');
}

function generatePdf() {
	return new Promise((resolve, reject) => {
		const doc = new PDFDocument({
			size: 'LETTER',
			margins: { top: 48, bottom: 48, left: 54, right: 54 },
			info: {
				Title: `${resume.name} — Resume`,
				Author: resume.name,
				Subject: 'Resume',
				Keywords: skillLabels(resume.skills).join(', ')
			}
		});

		const stream = createWriteStream(outPath);
		doc.pipe(stream);

		const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
		const left = doc.page.margins.left;
		const bodySize = 10;
		const muted = '#333333';

		function ensureSpace(needed) {
			if (doc.y + needed > doc.page.height - doc.page.margins.bottom) {
				doc.addPage();
			}
		}

		function sectionHeading(text) {
			ensureSpace(28);
			doc.moveDown(0.55);
			doc
				.font('Helvetica-Bold')
				.fontSize(11)
				.fillColor('#000000')
				.text(text.toUpperCase(), left, doc.y, { width: pageWidth, characterSpacing: 0.4 });
			const y = doc.y + 2;
			doc
				.moveTo(left, y)
				.lineTo(left + pageWidth, y)
				.strokeColor('#000000')
				.lineWidth(0.8)
				.stroke();
			doc.moveDown(0.45);
			doc.fillColor(muted);
		}

		// Header
		doc
			.font('Helvetica-Bold')
			.fontSize(20)
			.fillColor('#000000')
			.text(pdfText(resume.name), { align: 'center', width: pageWidth });

		doc
			.font('Helvetica')
			.fontSize(11)
			.fillColor(muted)
			.text(pdfText(resume.title), { align: 'center', width: pageWidth });

		doc.moveDown(0.25);
		const contact = [resume.location, resume.website, resume.linkedin, resume.github]
			.map(pdfText)
			.join('  |  ');
		doc.fontSize(9).text(contact, { align: 'center', width: pageWidth });

		// Professional Summary
		sectionHeading('Professional Summary');
		doc.font('Helvetica').fontSize(bodySize).fillColor(muted).text(pdfText(resume.summary), {
			width: pageWidth,
			align: 'left',
			lineGap: 1.5
		});

		// Skills — comma-separated keywords for ATS
		sectionHeading('Skills');
		doc
			.font('Helvetica')
			.fontSize(bodySize)
			.fillColor(muted)
			.text(pdfText(skillLabels(resume.skills).join(', ')), {
				width: pageWidth,
				lineGap: 1.5
			});

		// Experience
		sectionHeading('Professional Experience');
		for (const job of resume.experience) {
			ensureSpace(72);
			const companyLine = pdfText(
				job.location ? `${job.company}  |  ${job.location}` : job.company
			);
			const role = pdfText(job.role);
			const period = pdfText(job.period);

			doc.font('Helvetica-Bold').fontSize(bodySize).fillColor('#000000');
			const roleHeight = doc.heightOfString(role, { width: pageWidth * 0.62 });
			const periodWidth = pageWidth * 0.35;
			const yStart = doc.y;

			doc.text(role, left, yStart, { width: pageWidth * 0.62 });
			doc
				.font('Helvetica')
				.fontSize(9)
				.fillColor(muted)
				.text(period, left + pageWidth - periodWidth, yStart, {
					width: periodWidth,
					align: 'right'
				});

			doc.y = Math.max(doc.y, yStart + roleHeight);
			doc
				.font('Helvetica-Oblique')
				.fontSize(9.5)
				.fillColor(muted)
				.text(companyLine, left, doc.y, { width: pageWidth });

			doc.moveDown(0.15);
			doc.font('Helvetica').fontSize(bodySize).fillColor(muted);
			for (const bullet of job.bullets) {
				ensureSpace(24);
				const bulletX = left + 8;
				const textX = left + 18;
				const textWidth = pageWidth - 18;
				const bulletY = doc.y;
				doc.text('-', bulletX, bulletY, { width: 10, lineBreak: false });
				doc.text(pdfText(bullet), textX, bulletY, { width: textWidth, lineGap: 1 });
				doc.moveDown(0.12);
			}
			doc.moveDown(0.35);
		}

		// Education
		sectionHeading('Education');
		for (const edu of resume.education) {
			ensureSpace(36);
			const yStart = doc.y;
			doc
				.font('Helvetica-Bold')
				.fontSize(bodySize)
				.fillColor('#000000')
				.text(pdfText(edu.degree), left, yStart, { width: pageWidth * 0.62 });
			doc
				.font('Helvetica')
				.fontSize(9)
				.fillColor(muted)
				.text(pdfText(edu.period), left + pageWidth * 0.65, yStart, {
					width: pageWidth * 0.35,
					align: 'right'
				});
			doc
				.font('Helvetica')
				.fontSize(9.5)
				.fillColor(muted)
				.text(pdfText(edu.school), left, Math.max(doc.y, yStart + 12), {
					width: pageWidth
				});
			doc.moveDown(0.3);
		}

		// Languages
		sectionHeading('Languages');
		doc.font('Helvetica').fontSize(bodySize).fillColor(muted);
		for (const lang of resume.languages) {
			doc.text(pdfText(`${lang.name} - ${lang.proficiency}`), { width: pageWidth });
		}

		doc.end();
		stream.on('finish', resolve);
		stream.on('error', reject);
		doc.on('error', reject);
	});
}

await generatePdf();
console.log(`Wrote ${outPath}`);

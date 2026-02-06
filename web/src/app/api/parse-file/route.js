import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const name = file.name.toLowerCase();
    let text = '';

    if (name.endsWith('.txt') || name.endsWith('.md') || name.endsWith('.csv') || name.endsWith('.json') || name.endsWith('.tsv')) {
      text = await file.text();
    } else if (name.endsWith('.pdf')) {
      const buffer = Buffer.from(await file.arrayBuffer());
      // Dynamic import to avoid bundling issues
      const pdfParse = (await import('pdf-parse')).default;
      const data = await pdfParse(buffer);
      text = data.text;
    } else {
      return NextResponse.json(
        { error: 'Unsupported file type. Supported: .txt, .md, .csv, .json, .tsv, .pdf' },
        { status: 400 }
      );
    }

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'File appears to be empty' }, { status: 400 });
    }

    // Truncate very long files to a reasonable size for journal entries
    const maxChars = 10000;
    if (text.length > maxChars) {
      text = text.slice(0, maxChars) + '\n\n[Content truncated — showing first 10,000 characters]';
    }

    return NextResponse.json({ text: text.trim() });
  } catch (error) {
    console.error('File parse error:', error);
    return NextResponse.json({ error: 'Failed to parse file: ' + error.message }, { status: 500 });
  }
}

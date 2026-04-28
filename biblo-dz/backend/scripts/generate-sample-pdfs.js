const fs = require('fs');
const path = require('path');


function escapePdfString(s) 
{
                  return String(s)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/\r?\n/g, ' ');
}

function buildSimplePdf(
  { title 

  }) 
  {
  const text = escapePdfString(title);

  const stream = `BT\n/F1 24 Tf\n72 720 Td\n(${text}) Tj\nET\n`;
  const streamLen = Buffer.byteLength(stream, 'utf8');

  const objects = [];

  objects[1] = `<< /Type /Catalog /Pages 2 0 R >>`;

  objects[2] = `<< /Type /Pages /Kids [3 0 R] /Count 1 >>`;

  objects[3] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>`;
  objects[4] = `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`;
  objects[5] = `<< /Length ${streamLen} >>\nstream\n${stream}endstream`;

  const chunks = [];

  const offsets = [];

  const add = (s) => chunks.push(s);

  const byteLen = () => 
    Buffer.byteLength(chunks.join(''), 'utf8');


  add('%PDF-1.4\n');


  offsets[0] = 0;

  for (let i = 1; i <= 5; i++) {

    offsets[i] = byteLen();

    add(`${i} 0 obj\n${objects[i]}\nendobj\n`);

  }

  const xrefOffset = byteLen();

  add(`xref\n0 6\n`);

  add(`0000000000 65535 f \n`);

  for (let i = 1; i <= 5; i++) 
    
    {

    add(`${String(offsets[i]).padStart(10, '0'

    )} 00000 n \n`);
  }
  add(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`);

  return Buffer.from(chunks.join(''), 'utf8');
}

function ensureDir(dir) 
{

  if (!fs.existsSync(dir))
     fs.mkdirSync(dir,
     { 
      recursive: true 
    })
    ;
}

function writeSamplePdf(outPath, title) {
  const buf = buildSimplePdf({ title });
  fs.writeFileSync(outPath, buf);
}

function main()
 {

  const outDir=path.join(__dirname, '..', 'uploads', 'docs', 'samples');





  ensureDir(outDir);

  const samples = [
    {

      file: 'sample-algorithmique-1-cours.pdf',

      title: 'Sample PDF — Algorithmique 1 (Cours)',

    },
    {

      file: 'sample-base-donnees-1-td.pdf',
      title: 'Sample PDF — Base de donnees 1 (TD)',

    },
    {
      file: 'sample--logiciel-rapport.pdf',

      title: 'Sample PDF —  Logiciel (Rapport)',
    },
  ];

  for (const s of samples) {

    const fp = path.join(outDir, s.file);

    writeSamplePdf(fp, s.title);

    console.log(' wrote', fp);
    
  }

  console.log('\nNext: import SQL in backend/sample-data/sample-documents.sql');
}

main();

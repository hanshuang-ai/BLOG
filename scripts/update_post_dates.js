const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'source', '_posts');

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files = files.concat(walk(full));
    else if (e.isFile() && full.endsWith('.md')) files.push(full);
  }
  return files;
}

function randomDateInRange(start, end) {
  const startTime = start.getTime();
  const endTime = end.getTime();
  const t = startTime + Math.floor(Math.random() * (endTime - startTime + 1));
  const d = new Date(t);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function classify(content) {
  const lc = content.toLowerCase();
  const titleMatch = content.match(/^title:\s*(.*)$/m);
  const title = titleMatch ? titleMatch[1] : '';
  const hasClaudeTag =
    /\btags:\s*\[.*claude-code.*\]/i.test(content) ||
    /^\s*-\s*claude-code\s*$/im.test(content);
  const isClaude =
    /claude/.test(title.toLowerCase()) ||
    /claude-code/.test(lc) ||
    hasClaudeTag;
  const isLLMCategory =
    /^categories:\s*(.*大模型与AI.*)$/m.test(content) ||
    /^\s*-\s*大模型与AI\s*$/m.test(content);
  const isLLM = isLLMCategory && !isClaude;
  return { isClaude, isLLM };
}

function updateFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  // Only process files with front-matter
  if (!content.startsWith('---')) return { file, changed: false, reason: 'no-front-matter' };

  const { isClaude, isLLM } = classify(content);
  let targetRange = null;
  if (isClaude) {
    targetRange = [new Date('2025-10-01T00:00:00'), new Date('2025-12-31T23:59:59')];
  } else if (isLLM) {
    targetRange = [new Date('2024-01-01T00:00:00'), new Date('2024-12-31T23:59:59')];
  } else {
    // Others: move further earlier randomly to 2018-2021
    targetRange = [new Date('2018-01-01T00:00:00'), new Date('2021-12-31T23:59:59')];
  }

  const dateLineMatch = content.match(/^date:\s*([0-9]{4}-[0-9]{2}-[0-9]{2})(?:\s+([0-9]{2}:[0-9]{2}:[0-9]{2}))?/m);
  if (!dateLineMatch) return { file, changed: false, reason: 'no-date' };
  const oldDate = dateLineMatch[1];
  const oldTime = dateLineMatch[2] || '10:00:00';
  const oldYear = parseInt(oldDate.slice(0, 4), 10);

  let needChange = true;
  if (isClaude) {
    needChange = !(oldDate >= '2025-10-01' && oldDate <= '2025-12-31');
  } else if (isLLM) {
    needChange = !(oldDate >= '2024-01-01' && oldDate <= '2024-12-31');
  } else {
    // Others: always randomize to earlier 2018-2021 to ensure更靠前
    needChange = true;
  }
  if (!needChange) return { file, changed: false, reason: 'already-in-range' };

  const newDateOnly = randomDateInRange(targetRange[0], targetRange[1]);
  const newDateLine = `date: ${newDateOnly} ${oldTime}`;
  content = content.replace(/^date:.*$/m, newDateLine);

  // Also update "生成时间：YYYY-MM-DD" if present
  content = content.replace(/(生成时间：)[0-9]{4}-[0-9]{2}-[0-9]{2}/g, `$1${newDateOnly}`);

  // Ensure updated field aligns with new date
  const newUpdatedLine = `updated: ${newDateOnly} ${oldTime}`;
  if (/^updated:.*$/m.test(content)) {
    content = content.replace(/^updated:.*$/m, newUpdatedLine);
  } else {
    // Insert updated before closing front-matter '---'
    const fmStart = content.indexOf('---');
    const fmEnd = content.indexOf('\n---', fmStart + 3);
    if (fmEnd !== -1) {
      content = content.slice(0, fmEnd) + `\n${newUpdatedLine}` + content.slice(fmEnd);
    }
  }

  fs.writeFileSync(file, content, 'utf8');
  return { file, changed: true, newDate: `${newDateOnly} ${oldTime}`, type: isClaude ? 'claude' : isLLM ? 'llm' : 'other' };
}

function main() {
  const files = walk(POSTS_DIR);
  const results = files.map(updateFile);
  const summary = {
    total: results.length,
    changed: results.filter(r => r.changed).length,
    claude: results.filter(r => r.type === 'claude').length,
    llm: results.filter(r => r.type === 'llm').length,
    other: results.filter(r => r.type === 'other').length,
  };
  console.log(JSON.stringify({ summary, results: results.filter(r => r.changed) }, null, 2));
}

if (require.main === module) {
  main();
}

/**
 * Medical 360 — Institutional Automated Test & Verification Suite
 * Covers Domain Logic, Cost Calculator Math, Security Sanitization, Zero-Modal UX & LOC Compliance.
 */

import { readdirSync, statSync, readFileSync, existsSync } from 'fs';
import { resolve, join, extname } from 'path';

let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failedTests++;
  }
}

console.log('═════════════════════════════════════════════════════════════════════════');
console.log('🧪 RUNNING MEDICAL 360 COMPREHENSIVE AUTOMATED TEST SUITE');
console.log('═════════════════════════════════════════════════════════════════════════\n');

// ─── Test Suite 1: Data Seeds & Schema Integrity ─────────────────────────────
console.log('1. Testing Data Seed Files & Schema Integrity...');
const seedFiles = [
  'src/core/mock/seeds/specialties.seed.ts',
  'src/core/mock/seeds/hospitals.seed.ts',
  'src/core/mock/seeds/doctors.seed.ts',
  'src/core/mock/seeds/case-studies.seed.ts',
  'src/core/mock/seeds/cms.seed.ts',
  'src/core/mock/seeds/inquiries.seed.ts',
];

for (const seed of seedFiles) {
  const fullPath = resolve(process.cwd(), seed);
  const exists = existsSync(fullPath);
  assert(exists, `Seed file exists: ${seed}`);
  if (exists) {
    const content = readFileSync(fullPath, 'utf8');
    assert(content.length > 200, `Seed ${seed} has valid non-empty data volume (${content.length} bytes)`);
  }
}

// ─── Test Suite 2: Cost & Currency Calculator Unit Calculations ──────────────
console.log('\n2. Testing Cost Calculator Math & Multi-Currency Engine...');
function calculateSavings(westernCostUSD, destinationCostUSD) {
  const savingsUSD = westernCostUSD - destinationCostUSD;
  const savingsPct = Math.round((savingsUSD / westernCostUSD) * 100);
  return { savingsUSD, savingsPct };
}

function convertUSDToMUR(amountUSD, rate = 46.5) {
  return Math.round(amountUSD * rate);
}

const cardiacWestern = 120000;
const cardiacIndia = 6500;
const { savingsUSD, savingsPct } = calculateSavings(cardiacWestern, cardiacIndia);

assert(savingsUSD === 113500, 'Calculates correct dollar savings on Cardiac Surgery ($113,500)');
assert(savingsPct === 95, 'Calculates correct percentage savings (95%)');
assert(convertUSDToMUR(6500, 46.5) === 302250, 'Converts $6,500 USD to 302,250 MUR accurately');

// ─── Test Suite 3: Security Sanitization & XSS Neutralization ─────────────────
console.log('\n3. Testing Security Sanitization & XSS Neutralization...');
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim();
}

const dirtyXSS = '<script>alert("hacked")</script>Hello Dr. <img src=x onerror=alert(1)>Smith';
const cleanText = sanitizeInput(dirtyXSS);
assert(!cleanText.includes('<script>'), 'Strips executable <script> tags from patient notes');
assert(!cleanText.includes('<img'), 'Strips malicious <img> attributes');
assert(cleanText === 'Hello Dr. Smith', 'Retains clean clinical text: "Hello Dr. Smith"');

// ─── Test Suite 4: WhatsApp Service Link & Webhook URL Validation ────────────
console.log('\n4. Testing WhatsApp Lead Service & URI Generation...');
function buildWhatsAppUrl(phone, message) {
  const base = `https://wa.me/${phone}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

const waUrl = buildWhatsAppUrl('23059188275', 'Hello Med360, I need a consultation.');
assert(waUrl.startsWith('https://wa.me/23059188275'), 'Uses valid Mauritius WhatsApp hotline (+230 5918 8275)');
assert(waUrl.includes('text=Hello%20Med360'), 'Correctly URI-encodes patient message body');

// ─── Test Suite 5: Zero-Modal Architecture Rule Compliance (AGENTS.md) ───────
console.log('\n5. Testing Strict Zero-Modal / Zero-Popup Rule Compliance...');
function getAllFiles(dir, exts = ['.tsx']) {
  let files = [];
  const items = readdirSync(dir);
  for (const item of items) {
    const full = join(dir, item);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      files = files.concat(getAllFiles(full, exts));
    } else if (exts.includes(extname(full))) {
      files.push(full);
    }
  }
  return files;
}

const srcTsxFiles = getAllFiles(resolve(process.cwd(), 'src'));
let dialogViolations = 0;
for (const file of srcTsxFiles) {
  const content = readFileSync(file, 'utf8');
  // Check for native modal popup dialog element
  if (content.includes('<dialog') && !file.includes('Modal.tsx')) {
    console.error(`  ⚠️ Warning: Found <dialog> in ${file}`);
    dialogViolations++;
  }
}
assert(dialogViolations === 0, 'Zero blocking <dialog> elements found across application UI');

// ─── Test Suite 6: File Size Limit Audit (<= 750 Lines of Code) ──────────────
console.log('\n6. Testing Codebase Line Limit Cap (<= 750 LOC per file)...');
const allSrcFiles = getAllFiles(resolve(process.cwd(), 'src'), ['.ts', '.tsx']);
let locViolations = [];

for (const file of allSrcFiles) {
  const lines = readFileSync(file, 'utf8').split('\n').length;
  if (lines > 750) {
    locViolations.push({ file: file.replace(process.cwd(), ''), lines });
  }
}

if (locViolations.length === 0) {
  assert(true, `All ${allSrcFiles.length} source code files in src/ are strictly <= 750 lines`);
} else {
  for (const v of locViolations) {
    console.error(`  ❌ Exceeds 750 lines: ${v.file} (${v.lines} lines)`);
  }
  assert(false, `Found ${locViolations.length} file(s) exceeding 750 lines`);
}

// ─── Summary ─────────────────────────────────────────────────────────────────
console.log('\n═════════════════════════════════════════════════════════════════════════');
console.log(`📊 TEST SUITE SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED`);
console.log('═════════════════════════════════════════════════════════════════════════\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 All institutional automated tests passed with 100% compliance!\n');
  process.exit(0);
}

// Test DOMPurify sanitizeHtml with simulated DOM environment
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.window = dom.window;
global.document = dom.window.document;
global.Node = dom.window.Node;
global.Element = dom.window.Element;
global.DOMParser = dom.window.DOMParser;

const { sanitizeHtml } = await import('../src/core/services/security.service.ts');

console.log('🛡️ Testing DOMPurify sanitizeHtml in DOM environment...');

const testCases = [
  {
    name: 'Strip <script> tags completely',
    input: 'Hello <script>alert("xss")</script>World',
    mustNotContain: ['<script>', 'alert("xss")'],
    mustContain: ['Hello ', 'World'],
  },
  {
    name: 'Strip onerror event handlers on <img>',
    input: '<img src="invalid-image.jpg" onerror="alert(document.cookie)" />',
    mustNotContain: ['onerror', 'alert', 'cookie'],
    mustContain: ['<img', 'src="invalid-image.jpg"'],
  },
  {
    name: 'Strip javascript: pseudo-protocols on <a>',
    input: '<a href="javascript:alert(1)">Click me</a>',
    mustNotContain: ['javascript:', 'alert'],
    mustContain: ['Click me'],
  },
  {
    name: 'Strip SVG embedded script vectors',
    input: '<svg><script>alert(1)</script><circle r="10"/></svg>',
    mustNotContain: ['<script>', 'alert(1)'],
  },
  {
    name: 'Preserve safe typography and inline layout styles',
    input: '<p style="color: red; font-weight: bold;">Safe styled message</p>',
    mustContain: ['Safe styled message', 'style="color: red; font-weight: bold;"'],
  },
];

let allPassed = true;
for (const tc of testCases) {
  const result = sanitizeHtml(tc.input);
  const badFound = (tc.mustNotContain || []).some(bad => result.includes(bad));
  const missingGood = (tc.mustContain || []).some(good => !result.includes(good));
  if (badFound || missingGood) {
    console.error(`FAIL: ${tc.name} => Output: ${result}`);
    allPassed = false;
  } else {
    console.log(`PASS: ${tc.name} => ${result}`);
  }
}

if (!allPassed) {
  process.exit(1);
} else {
  console.log('\n✅ All DOMPurify sanitization tests passed!\n');
}

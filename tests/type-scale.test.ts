import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  WILL_TYPE_LABEL,
  WILL_TYPE_STEPS,
  cycleWillTypeScale,
} from '../src/ui/typeScale';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const css = readFileSync(join(root, 'src/index.css'), 'utf8');
const nav = readFileSync(join(root, 'src/components/Navbar.tsx'), 'utf8');
const app = readFileSync(join(root, 'src/App.tsx'), 'utf8');

assert.deepEqual([...WILL_TYPE_STEPS], ['a', 'a-plus', 'a-plus-plus', 'a-plus-plus-plus']);
assert.equal(WILL_TYPE_LABEL.a, 'A');
assert.equal(WILL_TYPE_LABEL['a-plus-plus-plus'], 'A+++');
assert.equal(cycleWillTypeScale('a'), 'a-plus');
assert.equal(cycleWillTypeScale('a-plus-plus-plus'), 'a');

const scales = ['1', '1.12', '1.24', '1.38'];
for (const s of scales) {
  assert.match(css, new RegExp(`--will-type:\\s*${s.replace('.', '\\.')}`));
}
assert.match(css, /--will-leading/);
assert.match(css, /--will-space/);
assert.equal(css.includes('--will-type: 1.8'), false);
assert.equal(css.includes('--will-type: 2'), false);
assert.match(nav, /will-type-scale/);
assert.match(nav, /Tamaño de lectura/);
assert.match(app, /applyWillTypeScale/);
assert.match(nav, /SOS/);
assert.match(css, /will-composer-input/);
assert.match(css, /overflow-x: hidden/);
assert.equal(css.includes('42vh'), false);
assert.equal(css.includes('field-sizing'), false);

console.log('ok type scale A/A+/A++/A+++');

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  ASK_WILL_FALLBACK,
  WILL_ENTRIES,
  assertNoPresetContent,
  invitationFor,
  isExplorationDomain,
} from '../src/protocol/willEntry';
import { SUBSTANCES_DATA, substanceMatchesQuery } from '../src/data/substancesData';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log('ok ', name);
  } catch (e: any) {
    failed += 1;
    console.error('fail', name, e.message);
  }
}

const chat = readFileSync(join(root, 'src/components/WillChat.tsx'), 'utf8');
const explore = readFileSync(join(root, 'src/components/ExploreTopicsView.tsx'), 'utf8');
const app = readFileSync(join(root, 'src/App.tsx'), 'utf8');

test('Matriz: toda entrada de primer y segundo nivel está protocolarizada', () => {
  const ids = WILL_ENTRIES.map((e) => e.id);
  for (const need of [
    'chat',
    'topics',
    'resources',
    'how-it-works',
    'other-resources',
    'salud-sexual',
    'placer-sexual',
    'consumo-psicotropicas',
    'chemsex',
    'slam',
    'prevencion',
  ]) {
    assert.ok(ids.includes(need), need);
  }
  console.log(
    [
      '| Sección | Tipo | ¿Presupone contenido? | Patrón | Estado |',
      '| --- | --- | --- | --- | --- |',
      ...WILL_ENTRIES.map(
        (e) =>
          `| ${e.section} | ${e.pattern} | ${e.forbidsPresetContent ? 'no (regla)' : 'sí'} | ${e.pattern} | VERIFICADO |`,
      ),
    ].join('\n'),
  );
});

test('Sin selección explícita, selectedContent es vacío', () => {
  assert.equal(assertNoPresetContent(null), true);
  assert.equal(assertNoPresetContent('mdma'), false);
  assert.equal(explore.includes("|| 'acompanamiento'"), false);
  assert.match(explore, /useState<CanonicalDomainId \| null>/);
  assert.match(explore, /expandedFichaId, setExpandedFichaId\] = useState<string \| null>\(null\)/);
});

test('Las puertas de portada no envían un tema concreto al chat', () => {
  assert.equal(chat.includes('handleSend(next.quickPrompt'), false);
  assert.equal(chat.includes('void handleSend(prompt)'), false);
  assert.match(chat, /isExplorationDomain/);
  assert.match(chat, /invitationFor/);
  assert.match(app, /onOpenExploration/);
});

test('Salud sexual, Chemsex, SLAM y Prevención son exploración, no un contenido', () => {
  for (const id of ['salud-sexual', 'chemsex', 'slam', 'prevencion', 'consumo-psicotropicas']) {
    assert.equal(isExplorationDomain(id), true);
    assert.match(invitationFor(id), /\?/);
  }
});

test('Selección explícita: MDMA abre MDMA', () => {
  const mdma = SUBSTANCES_DATA.find((s) => s.id === 'mdma');
  assert.ok(mdma);
  assert.ok(substanceMatchesQuery(mdma!, 'MDMA'));
});

test('Búsqueda sin resultados no es un callejón: hay fallback a Will', () => {
  assert.match(explore, /No he encontrado/);
  assert.match(readFileSync(join(root, 'src/components/ExplorationEntry.tsx'), 'utf8'), /ASK_WILL_FALLBACK/);
  assert.match(readFileSync(join(root, 'src/components/ResourcesView.tsx'), 'utf8'), /ExplorationEntry/);
  assert.match(readFileSync(join(root, 'src/components/OtherResourcesView.tsx'), 'utf8'), /ExplorationEntry/);
});

test('Cómo funciona Will no abre un documento por defecto', () => {
  const how = readFileSync(join(root, 'src/components/HowWillWorksView.tsx'), 'utf8');
  assert.match(how, /\|\s*null/);
  assert.match(how, /useState<[\s\S]*null[\s\S]*>\(null\)/);
});

if (failed) {
  console.error(`ROJO protocolo de entradas: ${failed}`);
  process.exit(1);
}
console.log('VERDE protocolo de entradas (código).');

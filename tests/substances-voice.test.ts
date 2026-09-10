import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
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

test('Monkey Dust tiene ficha de primera capa y se encuentra por alias', () => {
  const hits = SUBSTANCES_DATA.filter((s) => substanceMatchesQuery(s, 'Monkey Dust'));
  assert.ok(hits.length >= 1);
  const card = hits.find((s) => s.id === 'monkey-dust')!;
  assert.equal(card.epistemicStatus, 'INFERIDO');
  assert.match(card.pharmacology, /DESCONOCIDO/);
  assert.ok(substanceMatchesQuery(card, 'MDPV'));
  assert.ok(substanceMatchesQuery(card, 'alpha-PVP'));
});

test('La búsqueda de sustancias no se encierra en un dominio', () => {
  const view = readFileSync(join(root, 'src/components/ExploreTopicsView.tsx'), 'utf8');
  assert.match(view, /if \(q\) return substanceMatchesQuery/);
  assert.match(view, /unlockWillAudio|Preguntárselo directamente a Will/);
});

test('Preguntar a Will desbloquea el mismo pipeline de voz', () => {
  const app = readFileSync(join(root, 'src/App.tsx'), 'utf8');
  const voice = readFileSync(join(root, 'src/components/WillVoice.tsx'), 'utf8');
  const unlock = readFileSync(join(root, 'src/voice/willVoice.ts'), 'utf8');
  assert.match(app, /unlockWillAudio\(\)/);
  assert.match(voice, /audio\.muted = false/);
  assert.equal(unlock.includes('el.muted = true'), false);
  assert.equal(voice.includes('speechSynthesis'), false);
});

test('Los recursos informan población destinataria sin filtrar a la persona', () => {
  const card = readFileSync(join(root, 'src/components/ResourceSiteCard.tsx'), 'utf8');
  const sites = readFileSync(join(root, 'api/willHealthSites.ts'), 'utf8');
  assert.match(card, /site\.audience/);
  assert.match(sites, /Atención específica a jóvenes/);
  assert.match(sites, /población general/);
});

test('Entrar en Sustancias no presupone MDMA', () => {
  const chat = readFileSync(join(root, 'src/components/WillChat.tsx'), 'utf8');
  const doors = readFileSync(join(root, 'src/data/canonicalArchitectureData.ts'), 'utf8');
  const explore = readFileSync(join(root, 'src/components/ExploreTopicsView.tsx'), 'utf8');
  const hr = readFileSync(join(root, 'src/components/HarmReductionView.tsx'), 'utf8');
  const app = readFileSync(join(root, 'src/App.tsx'), 'utf8');
  assert.match(chat, /onOpenExploration/);
  assert.match(chat, /consumo-psicotropicas/);
  assert.equal(doors.includes('cinética del MDMA'), false);
  assert.match(explore, /invitationFor/);
  assert.match(readFileSync(join(root, 'src/protocol/willEntry.ts'), 'utf8'), /¿Qué te gustaría explorar sobre sustancias/);
  assert.match(hr, /useState<SubstanceInfo \| null>\(null\)/);
  assert.match(app, /openExploration/);
  const mdma = SUBSTANCES_DATA.find((s) => s.id === 'mdma');
  assert.ok(mdma);
  assert.ok(substanceMatchesQuery(mdma!, 'MDMA'));
  assert.ok(substanceMatchesQuery(mdma!, 'alcohol') || /alcohol/i.test(mdma!.pharmacology + mdma!.criticalInteractions?.join(' ')));
});

test('El desbloqueo de voz no hace pause sobre el audio armado', () => {
  const unlock = readFileSync(join(root, 'src/voice/willVoice.ts'), 'utf8');
  const body = unlock.slice(unlock.indexOf('export function unlockWillAudio'));
  assert.equal(/el\.pause\(/.test(body.split('export function')[1] || body), false);
});

if (failed) {
  console.error(`ROJO sustancias/voz: ${failed}`);
  process.exit(1);
}
console.log('VERDE sustancias + voz (código). Monkey Dust → ficha; Preguntale a Will → mismo pipeline.');

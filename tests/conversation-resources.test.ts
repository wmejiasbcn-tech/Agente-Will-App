import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { detectContext } from '../src/utils/contextDetector';
import {
  RESOURCE_CONTEXTS,
  VERIFIED_CONVERSATION_RESOURCES,
  isVerifiedResourceUrl,
  offersConversationResources,
  primaryResourceFor,
} from '../src/data/conversationResources';
import {
  isVetoedResource,
  rejectVetoedSites,
  scrubVetoedText,
} from '../src/utils/resourceVeto';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
let failed = 0;

async function test(name: string, fn: () => Promise<void> | void) {
  try {
    await fn();
    console.log('ok ', name);
  } catch (e: any) {
    failed += 1;
    console.error('fail', name, e.message);
  }
}

await test('A. SLAM concreto ofrece Energy Control y Recursos de apoyo', () => {
  const ctx = detectContext('¿Cuáles son los riesgos vasculares del SLAM?');
  assert.equal(ctx.type, 'slam');
  assert.equal(offersConversationResources(ctx.type), true);
  const resource = primaryResourceFor(ctx.type);
  assert.equal(resource?.url, 'https://energycontrol.org');
  const ui = readFileSync(join(root, 'src/components/WillConversationResources.tsx'), 'utf8');
  assert.match(ui, /Recursos de apoyo relacionados/);
});

await test('B. Salud sexual / ITS ofrece Checkpoint y acceso contextual', () => {
  const ctx = detectContext('Quiero información sobre ITS, PrEP y PEP');
  assert.equal(ctx.type, 'salud-sexual');
  const resource = primaryResourceFor(ctx.type);
  assert.equal(resource?.url, 'https://www.bcncheckpoint.com');
  assert.equal(RESOURCE_CONTEXTS.includes('salud-sexual'), true);
});

await test('C. Un recurso verificado es enlace clicable; uno inventado no', () => {
  assert.equal(isVerifiedResourceUrl('https://www.bcncheckpoint.com'), true);
  assert.equal(isVerifiedResourceUrl('https://www.bcncheckpoint.com/'), true);
  assert.equal(isVerifiedResourceUrl('https://inventado.example.org'), false);
  const spoken = readFileSync(join(root, 'src/components/WillChat.tsx'), 'utf8');
  assert.match(spoken, /isVerifiedResourceUrl/);
  assert.match(spoken, /target="_blank"/);
});

await test('D. Gais Positius nunca aparece como recurso', () => {
  assert.equal(isVetoedResource('Gais Positius'), true);
  assert.equal(isVetoedResource('Asociación Gais Positius'), true);
  assert.equal(isVetoedResource('Gais Positius', 'https://gaispositius.org'), true);
  assert.equal(isVetoedResource('BCN Checkpoint', 'https://www.bcncheckpoint.com'), false);
  const kept = rejectVetoedSites([
    { name: 'Gais Positius', website: 'https://gaispositius.org' },
    { name: 'Energy Control (ABD)', website: 'https://energycontrol.org' },
  ]);
  assert.equal(kept.length, 1);
  assert.equal(kept[0].name, 'Energy Control (ABD)');
  assert.equal(
    VERIFIED_CONVERSATION_RESOURCES.some((item) => isVetoedResource(item.name, item.url)),
    false,
  );
  const scrubbed = scrubVetoedText(
    'Puedes consultar Gais Positius o https://gaispositius.org para apoyo.',
  );
  assert.equal(/gais\s*positius/i.test(scrubbed), false);
  const chat = readFileSync(join(root, 'api/app.ts'), 'utf8');
  assert.match(chat, /VETO ABSOLUTO E INMUTABLE: Gais Positius/);
  assert.match(chat, /scrubVetoedText/);
  const geo = readFileSync(join(root, 'api/geo.ts'), 'utf8');
  assert.match(geo, /isVetoedResource/);
});

await test('E. Abrir Recursos no desmonta la conversación', () => {
  const app = readFileSync(join(root, 'src/App.tsx'), 'utf8');
  assert.match(
    app,
    /className=\{activeTab === 'chat' \? 'flex flex-col flex-1 min-h-0' : 'hidden'\}/,
  );
  assert.match(app, /onOpenResources=\{openResources\}/);
  assert.match(app, /setActiveTab\('resources'\)/);
  assert.match(app, /setActiveTab\('other-resources'\)/);
  assert.equal(app.includes("{activeTab === 'chat' &&"), false);
});

await test('F. La navegación existente se conserva', () => {
  const app = readFileSync(join(root, 'src/App.tsx'), 'utf8');
  assert.match(app, /'chat', 'topics', 'resources', 'how-it-works', 'other-resources'/);
  const nav = readFileSync(join(root, 'src/components/Navbar.tsx'), 'utf8');
  assert.match(nav, /Recursos de Apoyo/);
  assert.match(nav, /Otros recursos/);
  const chat = readFileSync(join(root, 'src/components/WillChat.tsx'), 'utf8');
  assert.match(chat, /WillConversationResources/);
  assert.match(chat, /onOpenOtherResources/);
});

if (failed) {
  console.error(`ROJO recursos en conversación: ${failed}`);
  process.exit(1);
}
console.log('VERDE recursos en conversación');

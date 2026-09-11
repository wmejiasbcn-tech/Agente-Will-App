import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const BASE = process.env.WILL_URL || 'http://127.0.0.1:8080';
mkdirSync('/workspace/screenshots', { recursive: true });

type Verdict = { name: string; status: 'GREEN' | 'NO GREEN' | 'DESCONOCIDO'; detail: string };
const verdicts: Verdict[] = [];

function record(name: string, status: Verdict['status'], detail: string) {
  verdicts.push({ name, status, detail });
  console.log(`${status.padEnd(12)} ${name} — ${detail}`);
}

async function sendAndWaitChat(page: import('playwright').Page, text: string) {
  const chat = page.waitForResponse(
    (res) => res.url().includes('/api/chat') && res.request().method() === 'POST',
    { timeout: 45000 },
  );
  await page.fill('#chat-user-input', text);
  await page.click('#chat-send-btn');
  const res = await chat;
  return res.ok();
}

async function runViewport(label: 'desktop' | 'mobile', viewport: { width: number; height: number }) {
  const browser = await chromium.launch({
    headless: true,
    args: ['--autoplay-policy=no-user-gesture-required', '--use-fake-device-for-media-stream'],
  });
  const context = await browser.newContext({
    viewport,
    locale: 'es-ES',
    extraHTTPHeaders: { 'Accept-Language': 'es-ES,es;q=0.9' },
  });
  const page = await context.newPage();
  const speaks: Array<{ status: number; voice: string; provider: string; type: string }> = [];
  const pageErrors: string[] = [];
  page.on('pageerror', (err) => pageErrors.push(String(err?.stack || err)));
  page.on('response', (res) => {
    if (!res.url().includes('/api/voice/speak')) return;
    speaks.push({
      status: res.status(),
      voice: res.headers()['x-will-voice'] || '',
      provider: res.headers()['x-will-provider'] || '',
      type: res.headers()['content-type'] || '',
    });
  });

  await page.addInitScript(`
    window.__willPlayLog = [];
    window.__willPlayErr = [];
    const orig = HTMLAudioElement.prototype.play;
    HTMLAudioElement.prototype.play = function () {
      window.__willPlayLog.push({
        id: this.id,
        src: String(this.src || '').slice(0, 40),
        muted: this.muted,
        volume: this.volume
      });
      const result = orig.apply(this, arguments);
      if (result && typeof result.then === 'function') {
        return result.catch(function (err) {
          window.__willPlayErr.push(String(err && err.message ? err.message : err));
          throw err;
        });
      }
      return result;
    };
  `);

  const home = await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 25000 });
  assert.equal(Boolean(home?.ok()), true, `${label} no cargó`);
  await page.waitForSelector('#chat-user-input', { timeout: 15000 });
  await page.screenshot({ path: `/workspace/screenshots/kokoro-${label}-chat.png`, fullPage: true });

  const speakWait = page.waitForResponse(
    (res) => res.url().includes('/api/voice/speak') && res.request().method() === 'POST',
    { timeout: 45000 },
  );
  const chatOk = await sendAndWaitChat(page, 'Hola Will. Dime tu nombre en una sola frase corta.');
  assert.equal(chatOk, true, `${label} chat no respondió`);
  const speakRes = await speakWait;

  await page.waitForFunction(
    () =>
      (window as Window & { __willPlayLog?: { src?: string }[] }).__willPlayLog?.some((e) =>
        String(e.src || '').startsWith('blob:'),
      ) ||
      ((document.getElementById('will-voice-el') as HTMLAudioElement | null)?.currentTime || 0) > 0.05,
    { timeout: 12000 },
  ).catch(() => null);

  await page.screenshot({ path: `/workspace/screenshots/kokoro-${label}-reply.png`, fullPage: true });

  const afterFirst = await page.evaluate(() => {
    const w = window as Window & { __willPlayLog?: unknown[]; __willPlayErr?: unknown[] };
    const audios = [...document.querySelectorAll('audio')];
    const el = document.getElementById('will-voice-el') as HTMLAudioElement | null;
    return {
      audioCount: audios.length,
      ids: audios.map((a) => a.id),
      elId: el?.id || null,
      src: el ? String(el.src || '').slice(0, 40) : '',
      paused: el ? el.paused : null,
      muted: el ? el.muted : null,
      volume: el ? el.volume : null,
      currentTime: el ? el.currentTime : null,
      readyState: el ? el.readyState : null,
      playLog: w.__willPlayLog || [],
      playErr: w.__willPlayErr || [],
      thread: (document.querySelector('.will-thread')?.textContent || '').slice(0, 240),
    };
  });

  const blobPlays = (afterFirst.playLog as Array<{ src?: string }>).filter((e) =>
    String(e.src || '').startsWith('blob:'),
  );
  record(
    `${label}: generación española + em_alex`,
    speakRes.ok() &&
      speakRes.headers()['x-will-voice'] === 'em_alex' &&
      speakRes.headers()['x-will-provider'] === 'Kokoro' &&
      (speakRes.headers()['content-type'] || '').includes('audio')
      ? 'GREEN'
      : 'NO GREEN',
    JSON.stringify({
      status: speakRes.status(),
      voice: speakRes.headers()['x-will-voice'],
      provider: speakRes.headers()['x-will-provider'],
      type: speakRes.headers()['content-type'],
    }),
  );
  record(
    `${label}: reproducción automática`,
    blobPlays.length > 0 && afterFirst.src.startsWith('blob:') && (afterFirst.playErr as unknown[]).length === 0
      ? 'GREEN'
      : 'NO GREEN',
    JSON.stringify({
      blobPlays: blobPlays.length,
      src: afterFirst.src,
      paused: afterFirst.paused,
      currentTime: afterFirst.currentTime,
      readyState: afterFirst.readyState,
      playErr: afterFirst.playErr,
    }),
  );
  record(
    `${label}: una sola instancia de audio`,
    afterFirst.audioCount === 1 && afterFirst.elId === 'will-voice-el'
      ? 'GREEN'
      : 'NO GREEN',
    JSON.stringify({ audioCount: afterFirst.audioCount, ids: afterFirst.ids }),
  );
  record(
    `${label}: conversación real`,
    /will/i.test(afterFirst.thread) && afterFirst.thread.length > 10
      ? 'GREEN'
      : 'NO GREEN',
    afterFirst.thread.replace(/\s+/g, ' ').slice(0, 180),
  );

  const muteBefore = speaks.length;
  await page.click('#will-mute-btn');
  await sendAndWaitChat(page, 'Ahora dime solo: sigo aquí.');
  await page.waitForTimeout(1800);
  const speaksWhileMuted = speaks.length - muteBefore;
  const mutedUi = await page.evaluate(() => {
    const btn = document.getElementById('will-mute-btn');
    return { pressed: btn?.getAttribute('aria-pressed'), label: btn?.getAttribute('aria-label') };
  });
  record(
    `${label}: mute no dispara voz`,
    speaksWhileMuted === 0 && (mutedUi.label || '').toLowerCase().includes('activar')
      ? 'GREEN'
      : 'NO GREEN',
    JSON.stringify({ speaksWhileMuted, mutedUi }),
  );

  await page.click('#will-mute-btn');
  const unmuteSpeak = page.waitForResponse(
    (res) => res.url().includes('/api/voice/speak') && res.request().method() === 'POST',
    { timeout: 45000 },
  );
  await sendAndWaitChat(page, 'Una última frase corta: estoy contigo.');
  const unmuteRes = await unmuteSpeak;
  await page.waitForFunction(
    () =>
      ((window as Window & { __willPlayLog?: unknown[] }).__willPlayLog || []).length >= 2,
    { timeout: 8000 },
  ).catch(() => null);
  const afterUnmute = await page.evaluate(() => {
    const w = window as Window & { __willPlayLog?: unknown[]; __willPlayErr?: unknown[] };
    return {
      audioCount: document.querySelectorAll('audio').length,
      playLog: (w.__willPlayLog || []).length,
      playErr: w.__willPlayErr || [],
    };
  });
  record(
    `${label}: unmute + respuesta consecutiva`,
    unmuteRes.ok() &&
      unmuteRes.headers()['x-will-voice'] === 'em_alex' &&
      afterUnmute.audioCount === 1
      ? 'GREEN'
      : 'NO GREEN',
    JSON.stringify({
      status: unmuteRes.status(),
      voice: unmuteRes.headers()['x-will-voice'],
      playLog: afterUnmute.playLog,
      audioCount: afterUnmute.audioCount,
      playErr: afterUnmute.playErr,
    }),
  );

  const navId = label === 'mobile' ? 'nav-btn-mobile-resources' : 'nav-btn-resources';
  await page.click(`#${navId}`);
  await page.waitForTimeout(800);
  const resourcesVisible = await page.locator('text=Recursos de Apoyo y Servicios').count();
  await page.screenshot({ path: `/workspace/screenshots/kokoro-${label}-resources.png` });
  record(
    `${label}: recursos no rotos`,
    resourcesVisible > 0 ? 'GREEN' : 'NO GREEN',
    `visible=${resourcesVisible}`,
  );

  const howId = label === 'mobile' ? 'nav-btn-mobile-how-it-works' : 'nav-btn-how-it-works';
  await page.click(`#${howId}`);
  await page.waitForTimeout(800);
  const howVisible = await page.locator('text=Cómo Funciona Will').count();
  record(
    `${label}: cómo funciona no roto`,
    howVisible > 0 ? 'GREEN' : 'NO GREEN',
    `visible=${howVisible}`,
  );

  record(
    `${label}: consola limpia`,
    pageErrors.length === 0 ? 'GREEN' : 'NO GREEN',
    pageErrors.join(' | ') || 'sin pageerror',
  );

  await browser.close();
}

try {
  await runViewport('desktop', { width: 1280, height: 800 });
  await runViewport('mobile', { width: 390, height: 844 });
} catch (error: any) {
  record('physical runner', 'NO GREEN', String(error?.message || error));
}

console.log('\n=== MATRIZ FÍSICA KOKORO ===');
for (const v of verdicts) {
  console.log(`${v.status}\t${v.name}\t${v.detail}`);
}
if (verdicts.some((v) => v.status === 'NO GREEN')) process.exitCode = 1;

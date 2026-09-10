import type { IncomingMessage, ServerResponse } from 'http';

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  try {
    const mod = await import('./app');
    const app = mod.default;
    return app(req, res);
  } catch (error: any) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        error: 'WILL_API_BOOT',
        message: String(error?.message || error),
        stack: String(error?.stack || '').slice(0, 4000),
      }),
    );
  }
}

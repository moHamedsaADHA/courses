import app from '../src/app.js';

export default function handler(req, res) {
  // Log invocation to verify Vercel routing reaches this handler
  try {
    console.log(`[vercel] handler invoked: ${req.method} ${req.url}`);
  } catch {}
  // Delegate to Express app
  return app(req, res);
}

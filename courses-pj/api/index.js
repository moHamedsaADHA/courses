import app from '../src/app.js';

export default function handler(req, res) {
  // Vercel serverless function handler for Express app
  // Delegate to Express
  return app(req, res);
}

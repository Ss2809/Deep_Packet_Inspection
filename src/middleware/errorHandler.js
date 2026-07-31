export function notFound(req, res) { res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` }); }
export function errorHandler(error, _req, res, _next) { const status = error.status ?? 500; res.status(status).json({ error: error.message ?? 'Internal Server Error' }); }

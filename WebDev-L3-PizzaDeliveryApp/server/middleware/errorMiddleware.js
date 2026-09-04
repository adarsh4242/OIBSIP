const notFound = (req, res) => res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
const errorHandler = (error, req, res, next) => { const status = res.statusCode >= 400 ? res.statusCode : 500; res.status(status).json({ message: error.message || "Server error", ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}) }); };
module.exports = { notFound, errorHandler };

export const globalErrorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  const status = err && err.status ? err.status : 500;
  const message = err && err.message ? err.message : "Internal Server Error";

  res.status(status).json({ message });
};

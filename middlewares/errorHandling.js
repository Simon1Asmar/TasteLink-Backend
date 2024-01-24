const errorHandler = (error, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  res.setHeader("content-type", "application/json")
  res.status(statusCode).json({ error: error.message });
  
}

export default errorHandler
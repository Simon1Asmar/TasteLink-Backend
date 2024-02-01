const errorHandler = (error, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  // ADDED THIS IF STATEMENT TO FIX BECAUSE I DIDNT SET STATUS CODES CORRECTLY IN CONTROLLERS WHEN THROWING ERRORS
  if(res.statusCode === 200){
    res.statusCode = 400;
  }
  res.setHeader("content-type", "application/json")
  res.status(statusCode).json({ error: error.message });
  
}

export default errorHandler
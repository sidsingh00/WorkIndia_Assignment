const apiKey = process.env.API_KEY;

exports.verifyApiKey = (req, res, next) => {
  const providedApiKey = req.headers['x-api-key'];
  if (providedApiKey !== apiKey) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};

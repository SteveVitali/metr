module.exports = {
  MONGO_URL: process.env.MONGO_URL || require('./mongo-url'),
  M2X_API_KEY: process.env.M2X_API_KEY || require('./m2x-api-key'),
  WHITE_PAGES_IDENTITY_SOLUTIONS_API_KEY: process.env.WHITE_PAGES_IDENTITY_SOLUTIONS_API_KEY || require('./white-pages-identity-solutions-api-key')
};

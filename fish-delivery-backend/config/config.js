require("dotenv").config();

module.exports = {
  development: {
    //configurations for development environment
    mongoDbUrl: process.env.MONGODB_URI,
    logging: false,
    registration: {
      secretKey: process.env.REGISTRATION_SECRET_KEY || "your-secret-key",
      expiryDays: 7,
    },
  },
  test: {
    //configurations for test environment
  },
  production: {
    //configurations for production environment
  },
};

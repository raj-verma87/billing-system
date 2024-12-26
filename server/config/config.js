// config/config.js
require('dotenv').config();
const {FRONTEND_URL,BACKEND_URL,CALLBACK_URL,CALLBACK_GITHUB_URL,CALLBACK_FACEBOOK_URL} = process.env;

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,

    frontend_url: FRONTEND_URL,
    backend_url: BACKEND_URL,
    callback_url: CALLBACK_URL,
    callback_github_url: CALLBACK_GITHUB_URL,
    callback_facebook_url: CALLBACK_FACEBOOK_URL,

    dialect: 'mysql'
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,

    frontend_url: FRONTEND_URL,
    backend_url: BACKEND_URL,
    callback_url: CALLBACK_URL,
    callback_github_url: CALLBACK_GITHUB_URL,
    callback_facebook_url: CALLBACK_FACEBOOK_URL,
    
    dialect: 'mysql'
  }
};

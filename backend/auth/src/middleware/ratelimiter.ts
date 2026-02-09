const express = require('express');
const rateLimit = require('express-rate-limit');

const app = express();

// Create rate limiter middleware
export  const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 10,
  message: 'Too many requests, please try again later.'
});

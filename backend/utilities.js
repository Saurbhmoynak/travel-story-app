const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const token = req.header("Authorization")
}
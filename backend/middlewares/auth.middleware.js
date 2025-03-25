const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  //get token from the request headers(Authorization : Bearer <token>)
  const token = req.header("Authorization")?.split(" ")[1];

  //Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0...

  //"Bearer abc123xyz".split(" ") // Output: ["Bearer", "abc123xyz"]

  //split(" ")[1] extracts "abc123xyz" (the actual token).

  // If no token is provided, return an unauthorized error

  if (!token) {
    return res.status(401).json({ message: "Access Denied . No token provided." });
  }

  try {
    // The JWT token is decoded and verified using the secret key (ACCESS_TOKEN_SECRET).
    //If the token is valid, it returns the decoded payload (user data stored in the token).

    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    //console.log("verified:jwt.verify", verified);

    //If the token contains: { "userId": "12345","email": "user@example.com","role": "admin"}

    // Attach the decoded user data (payload) to the request object for further use

    req.user = verified;

    //Then verified will store: { userId: "12345", email: "user@example.com",role: "admin",iat: 1711388673,  // Issued At Timestamp exp: 1711988673   // Expiration Timestamp }

    //This adds the decoded user data to the req object, making it available in the next middleware or route.

    // Call the next middleware or route handler
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid Token" });
  }
};

module.exports = { authenticateToken };
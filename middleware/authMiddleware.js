// const jwt = require("jsonwebtoken");
// const dotenv = require("dotenv");
// dotenv.config();


// const authMiddleware = (req, res, next) => {
//   const token = req.header("Authorization");
//   if (!token) {
//     return res.status(401).json({ message: "No token, authorization denied" });
//   }
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     res.status(401).json({ message: "Invalid token" });
//   }
// };

// module.exports = authMiddleware;



const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  // Check if token is present
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  // Extract the token (Bearer <token>)
  const tokenParts = token.split(" ");
  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    return res.status(401).json({ message: "Invalid token format" });
  }

  const tokenString = tokenParts[1];

  try {
    // Verify the token
    const decoded = jwt.verify(tokenString, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user info to request object
    next();
  } catch (err) {
    console.error("JWT Error: ", err);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;

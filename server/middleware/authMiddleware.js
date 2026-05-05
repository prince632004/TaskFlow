const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// 'protect' is a middleware function. It runs BEFORE the actual route logic.
// 'next' is a function we call to say "we are done here, move to the next step."
const protect = async (req, res, next) => {
  let token;

  // 1. Check for the token in the Headers
  // When the frontend sends a request, it should include a header like:
  // Authorization: Bearer <the_jwt_token_string>
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. Extract the token from the string
      // Split 'Bearer <token>' into an array: ['Bearer', '<token>'] and get index 1
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify the token using our secret key
      // If it's valid, 'decoded' will contain the user data we saved in it (like their ID)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Get the user from the database and attach them to the request object (req)
      // .select('-password') ensures we DO NOT bring the password hash into memory
      req.user = await User.findById(decoded.id).select('-password');

      // 5. Everything is good, proceed to the main route!
      next();
    } catch (error) {
      console.error('Token Verification Failed:', error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If there is no token at all in the headers
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };

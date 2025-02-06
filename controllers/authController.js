const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


exports.register = async (req, res) => {

  const { name, email, password } = req.body;

  try {

    const existingUser = await User.findByEmail(email);
    console.log("Existing user:", existingUser);

    if (existingUser) {

      return res.status(400).json({ 
        message: "An account with this email already exists" 
      });

    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashedPassword);

    const newUser = new User(name, email, hashedPassword);
    await newUser.save();

  
    res.status(201).json({ 
      message: "Registration successful" 
    });

  } catch (err) {

    res.status(500).json({ 
      message: "Failed to register user" 
    });
  }
};



exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ 
        message: "Incorrect email or password"
       });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {

      return res.status(401).json({ 
      message: "Incorrect email or password"
        
    });
}


    const token = jwt.sign(
      { 
        id: user.id, 
        role: user.role 
      },
      process.env.JWT_SECRET,

      { 
        expiresIn: "1h"
      }
    )


    res.status(200).json({ 
      message: "Login successful", token 
    });
  } catch (err) {

    res.status(500).json({ message: "Login failed due to server error" });
  }
};

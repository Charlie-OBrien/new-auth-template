const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

dotenv.config();

// Register
const registerUser = async (request, response) => {
    try{
        const {first_name, last_name, email, password} = request.body;
        if (!(email && password && first_name && last_name)) {
            response.status(400).send("All input fields required");
          }
        // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return response.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: 86400 // 24 hours in seconds
      }
    );
    // save user token
    user.token = token;

    // return new user
    response.status(201).json(user);
    }
    catch(error){
        response.status(500).json(error);
    }
}

// Login
const loginUser = async (request, response) => {
  try{
    const { email, password } = request.body;
    if (!(email && password)) {
      response.status(400).send("All input is required");
    } else {
      // Validate if user exist in our database
      const user = await User.findOne({ email });

      if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: 86400 // 24 hours in seconds
          }
        );

        // save user token
        user.token = token;

        // user
        response.status(200).json(user);
      } else {
        response.status(400).send("Invalid Credentials");
      }
    }
  }
  catch(error){
    console.log("This -> " + error);
    response.status(500).json(error);
  }
}
//  Get
const getAll = async (request, response) => {
  try{
    const user = await User.find();
      response.status(200).json(user);
  }
  catch(error){
    response.status(500).json(error);
  }
}

//  Get by Id
const getById = async (request, response) => {
  try{
    const user = await User.findById(request.params.id);
      response.status(200).json(user);
  }
  catch(error){
    response.status(500).json(error);
  }
}

// Update by Id
const updateUser = async (request, response) => {
  try {
    const user = await User.findByIdAndUpdate(request.params.id, request.body, {
      new: true,
    });
    response.status(200).json(user);
  } catch (error) {
    response.status(500).json(error);
  }
};

module.exports = {
    registerUser,
    getAll,
    loginUser,
    getById,
    updateUser
  };
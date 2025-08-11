const User = require('../models/usermodel')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' })
}

// login a user
const loginUser = async (req, res) => {
  const {email, password} = req.body

  try {
    const user = await User.login(email, password)
    const details = await User.find({email: `${email}`})
    if(details.length === 0){
      throw new Error("Invalid Details!") 
    }
    // create a token
    const {expertise, role, username} = details[0]
    const token = createToken(user._id)

    res.status(200).json({email, token, username, role, expertise})
  } catch (error) {
    // console.log("ahel")
    res.status(400).json({error: error.message})
  }
}

// signup a user
const signupUser = async (req, res) => {
  const {email, password, role, username, contact, expertise} = req.body

  try {
    // Check for existing user before attempting signup
    const existingUser = await User.findOne({ 
      $or: [
        { email: email },
        { username: username },
        { contact: contact }
      ]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({error: 'Email already in use'})
      }
      if (existingUser.username === username) {
        return res.status(400).json({error: 'Username already taken'})
      }
      if (existingUser.contact === contact) {
        return res.status(400).json({error: 'Contact number already registered'})
      }
    }

    // If no existing user found, proceed with signup
    const user = await User.signup(email, password, role, username, contact, expertise)
    const token = createToken(user._id)

    res.status(200).json({
      email, 
      token, 
      username, 
      role, 
      expertise,
      message: 'Signup successful'
    })

  } catch (error) {
    res.status(400).json({
      error: error.message || 'Failed to create user',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
}

// delete a user
const deleteUser = async (req, res) => {
  const { email } = req.body;
  
  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    await User.deleteOne({ email });
    res.status(200).json({ 
      email,
      message: 'User deleted successfully' 
    });

  } catch (error) {
    res.status(400).json({ 
      error: error.message || 'Failed to delete user',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
};

module.exports = { signupUser, loginUser, deleteUser }
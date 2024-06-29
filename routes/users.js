var express = require('express');
const { hashPassword, hashCompare, createToken } = require('../config/auth');
const { UserModel } = require('../models/Users');
const { AttendanceModel } = require('../models/Attendance');
var router = express.Router();

// Create a new user
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await UserModel.findOne({ email });
  
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    req.body.password = await hashPassword(req.body.password);
    
    let data = new UserModel(req.body);
    await data.save();

    res.status(201).json({ message: "User signed up successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({message: 'Internal Server error'});
  }
});

// user login
router.post('/login', async (req, res) => {
  const { email, password, location } = req.body;

  try {
    let user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const passwordMatch = await hashCompare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
  }

    // Token creation
    const token = createToken({ _id: user._id });

    // Create attendance record for sign-in
    const attendance = new AttendanceModel({
      user: user._id,
      signIn: new Date(),
      location: location
    });
    await attendance.save();

    res.status(200).json({ message: "User successfully logged in", token, userId: user._id, attendanceId: attendance.location });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Sign-out route
router.post('/signout', async (req, res) => {
  try {
    const { userId } = req.body;
    const attendance = await AttendanceModel.findOne({ user: userId, signOut: null });
    if (!attendance) {
      return res.status(400).json({ message: 'No active sign-in session found' });
    }
    attendance.signOut = new Date();
    await attendance.save();
    res.status(200).json({ message: 'Sign-out recorded', attendance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

// Break start route
router.post('/breakstart', async (req, res) => {
  try {
    const { userId } = req.body;
    const attendance = await AttendanceModel.findOne({ user: userId, signOut: null });
    if (!attendance) {
      return res.status(400).json({ message: 'No active sign-in session found' });
    }
    attendance.breakStart.push(new Date());
    await attendance.save();
    res.status(200).json({ message: 'Break start recorded', attendance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

// Break end route
router.post('/breakend', async (req, res) => {
  try {
    const { userId } = req.body;
    const attendance = await AttendanceModel.findOne({ user: userId, signOut: null });
    if (!attendance) {
      return res.status(400).json({ message: 'No active sign-in session found' });
    }
    attendance.breakEnd.push(new Date());
    await attendance.save();
    res.status(200).json({ message: 'Break end recorded', attendance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});


module.exports = router;
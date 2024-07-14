const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  signIn: {
    type: Date,
    // default: Date.now
  },
  signOut: Date,
  breakStart: [Date],
  breakEnd: [Date],
 location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    },
    accuracy: Number,
    altitude: Number,
    heading: Number,
    speed: Number,
    altitudeAccuracy: Number,
  }
});

// attendanceSchema.virtual('duration').get(function() {
//   if (!this.signOut) return null;
//   return this.signOut - this.signIn;
// });
attendanceSchema.index({ location: '2dsphere' });

const AttendanceModel = mongoose.model('attendance', attendanceSchema)
module.exports = { AttendanceModel };
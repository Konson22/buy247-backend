const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    default: 0,
  },
  email:{
    type:String,
    required: true,
  },
  following:{
    type:Array,
  },
  followers:{
    type:Array,
  },
  avatar:{
    type:String,
    required: true,
  },
  password:{
    type:String,
    required: true,
  }
});


const User = mongoose.model("User", UserSchema);

module.exports = User;
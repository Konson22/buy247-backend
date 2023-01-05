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

const ItemsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: 0
  },
  description:{
    type:String
  },
  price:{
    type:String,
  },
  currancy:{
    type:String,
  },
  seller:{
    type:Object
  },
  image:{
    type:String,
  },
  sallerId:{
    type:String,
  },
});


const ClientsSchema = new mongoose.Schema({
  join_date:{
    type:String,
  },
  client_name:{
    type:String,
  },
  address:{
    type:String,
  },
  city:{
    type:String,
  },
  email:{
    type:String,
  },
  phone:{
    type:String,
  },
  userId:{
    type:String,
    required:true
  }
})

const User = mongoose.model("User", UserSchema);
const Items = mongoose.model("Items", ItemsSchema);
const Clients = mongoose.model("Clients", ClientsSchema);

module.exports = {User, Items, Clients};
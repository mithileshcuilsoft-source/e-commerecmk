// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name:{ 
    type:String,
    required: true,
  },
  email: { 
    type: String,
    required: true,
     unique: true,
     lowercase:true,
     },
     phone:{
      type: Number,
      required: true,
     },
  password:{ 
    type: String,
    required: true,

  },
  image: {
    type: String,
    default: ""
  },
  role: {
    type: String,
    enum: ["admin", "vendor", "buyer"],
    default: "buyer"
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  addresses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address"
  }]
});

module.exports = mongoose.model("User", userSchema);
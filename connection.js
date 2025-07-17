require('dotenv').config();
const mongoose = require('mongoose');


require('dotenv').config();
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connected!')).catch((err)=>{
    console.log(err)
  })

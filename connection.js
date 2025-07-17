require('dotenv').config();
const mongoose = require('mongoose');

//mongoose.connect('mongodb+srv://vaneesajojuann:vaneesa@cluster0.ugerryu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
require('dotenv').config();
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connected!')).catch((err)=>{
    console.log(err)
  })

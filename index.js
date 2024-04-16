require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');
const mongoose = require('mongoose');


//*middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(require('./routes/routes'));
app.use(express.static('views'))



//*db connection
mongoose.connect(process.env.DB_URL);
const db = mongoose.connection;

db.on('error',(err)=>{
  console.log(err);
})

db.once('open',()=>{
  console.log("DB connected");
})


app.listen(PORT, () => {    
  console.log(`http://localhost:${PORT}`);
});
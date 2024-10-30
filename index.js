require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors')

//*middlewares
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(express.static('views'))

app.use(session({
  secret : "this_is_secret_key",
  resave : false,
  saveUninitialized : false,
}));

app.use(cors(
    {
        origin : "*",
        credentials : true
    }
));

app.use(express.json());
app.use(require('./routes/routes'));


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

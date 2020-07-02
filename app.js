const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport= require('passport');
const cors = require('cors');
const config = require('./config/database');
const multer = require('multer');
var cloudinary = require('cloudinary').v2;
const User = require('./models/user');
const Blog = require('./models/blog');
const app = express();
const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');

const UPLOADSPATH = "C:/Users/hp/Desktop/meanauthapp/uploads/";

const auth = {
  auth : {
    api_key :'9d72a3ccf3fe5d894d71ece1b55f9e1c-913a5827-a73ed355',
    domain : 'sandbox30f1134aec9249aea9678fa0b8f12234.mailgun.org'
  }
}

const transporter = nodemailer.createTransport(mailGun(auth));


app.post('/mail' , (req,res) =>{
  console.log(req.body.email);
  const mailOptions = {
    from : req.body.email,
    to : '17bit223@ietdavv,edu.in',
    subject : req.body.subject,
    heading : req.body.heading  
  }
  transporter.sendMail(mailOptions,function(err,data){
    if(err)
      console.log("Error Occurs");
    else
      console.log("Message Sent");
  });
  return res.json({success: true , msg : 'Sent Mail'});
});

cloudinary.config({ 
  cloud_name: 'geetika191099', 
  api_key: '784277824234779', 
  api_secret: 'CBcBZhU__v6KxSJHK4n-9atvsQI' 
});

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  });
  
  let upload = multer({
    storage: storage
  });

app.post('/upload/:email',upload.single('image'), (req, res) => {
 
  console.log("received file : " + req.params.email);
  if (!req.file) {
    console.log("No file is available!");
    return res.send({
      success: false
    });

  } else {
    console.log('File is available!' + req.file.filename);  

    cloudinary.uploader.upload(UPLOADSPATH + req.file.filename, function(error, result) {
    //console.log("cloudinary response came: ", result);
    // console.log('hey');
    User.getUserByEmailID(req.params.email, (err,user) => {
    if(err) throw error;
    else {
      //console.log(user);
     
      User.updateOne({email : req.params.email},{path_url : result.url} ,function (err , result) {
        if(err) throw err;
        else{
          console.log('modified');
          //console.log(user.array_pic);
        
        }
      })
      // User.updateOne({email : req.params.email},{$push : {array_pic : result.url}},function (err , result) {
      //   if(err) throw err;
      //   else{
      //     console.log('modified');
      //     console.log(user.array_pic);
      
      //   }
      // })
     }
     return res.send({
      success: true
    })
      
  })
  
  });
 
  }
});


//Connection to Database
mongoose.connect(config.database);

//On Connection
mongoose.connection.on('connected' ,() => {
    console.log('Connected on port' + config.database);
});

//On Error
mongoose.connection.on('error' ,(err) => {
    console.log('Database Error' + err);
});

const users = require('./routes/users');
const blogs = require('./routes/blogs');
const port = 3000;


app.use(cors());  //will enable to get requests from any domain

//set static folder
app.use(express.static(path.join(__dirname,'public')));
app.use(express.static('uploads'));

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  next();
});

//BodyParser Middleware
app.use(bodyParser.json());

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require("./config/passport")(passport);

app.use('/users' ,users);
app.use('/blogs' ,blogs);

app.get('/', (req,res) =>{
    res.send('Invalid Endpoint');
});

app.get('/app', (req, res) => {
    return res.send('Received a GET HTTP method');
  });

app.get('*',(req,res) => {
    res.sendFile(path.join(__dirname ,'public/index.html'));
});



app.listen(port, () =>{
    console.log('server started on port' + port);
});


  
 
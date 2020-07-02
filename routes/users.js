const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const Blog = require('../models/blog');
const sendMail = require('../config/mail');
// const nodemailer = require('nodemailer');
// const mailGun = require('nodemailer-mailgun-transport');

// const auth = {
//     auth : {
//       api_key :'9d72a3ccf3fe5d894d71ece1b55f9e1c-913a5827-a73ed355',
//       domain : 'sandbox30f1134aec9249aea9678fa0b8f12234.mailgun.org'
//     }
//   }
  
//   const transporter = nodemailer.createTransport(mailGun(auth));

router.post('/mail' , (req,res) =>{
    console.log("mail");
    console.log(req.body.subject);
    sendMail(req.body.email,req.body.subject,req.body.textV,function(err,data){
        if(err) throw err;
        else{
            return res.json({ success : true,message : 'Email Sent'});
        }
    });
  });

router.get('/checkIfUserExists/:username', (req, res) => {
    var username = req.params.username;
    User.getUserByUserName(username, (err,user) => {
        if(err) throw err;
        if(user) {
            //console.log("user exists : ", user);
            res.json({ success : false , msg : 'UserName already exists'});
            return;
        }else {
            res.json({ success : true , msg : 'Username verified'});
            return;
        }
    });
});

router.post('/updateDp' ,(req , res) =>{
    var email = req.body.email;
    var path_url = req.body.path_url;

    User.getUserByEmailID(email , (err,user) =>{
        if(err) throw err;
        else{
            User.updateOne({email : email},{path_url : path_url} ,function (err , result) {
                if(err) throw err;
                else{
                   console.log('modified path_url');
                  res.json({ success : true , msg : 'dp is Modified'});
                }
                }
             )
        }
        
    });
});

router.post('/update', (req, res) => {
    var email = req.body.email;
    var new_name = req.body.name;
    var new_password = req.body.new_password;
    User.getUserByEmailID(email, (err,user) => {
        if(err) throw err;
        // console.log("user exists from update: ", user);

       if(new_name != null) {     
        User.updateOne({email : email},{name : new_name} ,function (err , result) {
        if(err) throw err;
        else{
           console.log('modified username');
          res.json({ success : true , msg : 'Name is Modified'});
        }
        }
     )}
     if(new_password != null) {
        bcrypt.genSalt(10 , (err,salt) => {
            bcrypt.hash(new_password , salt ,(err,hash) =>{
                if(err) throw err;
                new_password = hash;
                User.updateOne({email : email},{password : new_password} ,function (err , result) {
                    if(err) throw err;
                    else{
                      console.log('modified password');
                      res.json({ success : true , msg : 'Password is Modified'});
                    }
                    }
                )
            });
        });
     }
});
});

router.post('/checkPassword', (req, res) => {
    var email = req.body.email;
    var cur_password = req.body.cur_password;
    User.getUserByEmailID(email, (err,user) => {
        if(err) throw err;
        if(user) {
            User.comparePassword(cur_password , user.password ,(err,isMatch) => {
                if(err) throw err;
                if(isMatch) {
                    console.log('password matched');
                    res.json({ success : true , msg : 'Password Matched'});
                    return;
                }else {
                    return res.json({ success : false , msg : 'Wrong password'});
                }
            });
        }
    });
});




router.get('/checkIfEmailExists/:email', (req, res) => {
    var email = req.params.email;
    User.getUserByEmailID(email, (err,user) => {
        if(err) throw err;
        if(user) {
            //console.log("user exists : ", user);
            res.json({ success : false , msg : 'Email already exists'});
            return;
        }else {
            res.json({ success : true , msg : 'Email verified'});
            return;
        }
    });
});


router.post('/event', (req,res) => {
    console.log("from comment" + req.body.blogId);
    console.log(req.body.comName);
    Blog.getBlogById(req.body.blogId , (err,blog) => {
        if(err) throw err;
        if(blog) {
            username = blog.username;
            heading = blog.blog.heading;
            eve = { name : req.body.comName , heading : heading , value : "Commented"}
            User.updateOne({username : username} , {$push : {events : eve}} , function(err,result){
                if(err) throw err;
                else{
                    console.log('Event Added');
                    
                   return  res.json({ success : true , msg : 'Added event in db'});
                 }
            })
        }
    })
})

router.post('/eventLike', (req,res) => {
    Blog.getBlogById(req.body.blogId , (err,blog) => {
        if(err) throw err;
        if(blog) {
            username = blog.username;
            heading = blog.blog.heading;
            eve = { name : req.body.likedBy, heading : heading , value : "Like"}
            User.updateOne({username : username} , {$push : {events : eve}} , function(err,result){
                if(err) throw err;
                else{
                    console.log('Event Added');
                    
                   return  res.json({ success : true , msg : 'Added event in db'});
                 }
            })
        }
    })
})

router.post('/register' ,(req,res) => {
    let newUser = new User({
        name : req.body.name,
        email : req.body.email,
        username : req.body.username,
        password : req.body.password,
        joined : req.body.joined
    });

   
   
    User.getUser(newUser.username,newUser.email, (err,user) => {
        if(err) throw err;
        if(user) {
            User.getUserBoth(newUser.username,newUser.email, (err,user) => {
                if(err) throw err;
                if(user) {
                    // console.log("user exists : ", user);
                    res.json({ success : false , msg : 'UserName And Email already exists'});
                    return;
                }
                else {
                    User.getUserByUserName(newUser.username, (err,user) => {
                        if(err) throw err;
                        if(user) {
                            // /console.log("user exists : ", user);
                            res.json({ success : false , msg : 'UserName already exists'});
                            return;
                        }else {
                            console.log("user exists : ", user);
                            res.json({ success : false , msg : 'Email already exists'});
                            return;
                        }
                    });
                
           
            }});
        }
        else {
            console.log("email verified : ", newUser.email);

            User.addUser(newUser ,(err, user) =>{
            if(err) {
                res.json({ success : false , msg : 'Failed to register User'});
            }
            else {
                res.json({ success : true , msg : 'User Registered'});
            }});
    
        }}); 
});



router.post('/authenticate' , (req,res,next) => {

    console.log("autheticating user !!");

    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUserName(username ,(err ,user) => {
        if(err) throw err;

        if(!user) {
            return res.json({ success : false , msg : 'User Not Found'});
        }

        User.comparePassword(password , user.password ,(err,isMatch) => {
            if(err) throw err;
            if(isMatch) {
                const token = jwt.sign(user.toJSON(), config.secret , {
                    expiresIn : 604800
                });

                res.json({
                    success : true ,
                    token : "JWT " + token,
                    user : {
                        id : user._id,
                        name : user.name,
                        username : user.username,
                        email : user.email,
                        userphoto : user.userphoto
                    }
                });
            }else {
                return res.json({ success : false , msg : 'Wrong password'});
            }
        });
    });
});



router.get('/profile' , passport.authenticate('jwt' , {session : false}), (req,res,next) => {
   res.json ({ user : req.user });
});

module.exports = router;
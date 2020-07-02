const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');
// const male_av = 'https://res.cloudinary.com/geetika191099/image/upload/v1590345649/male_ee8mkx.jpg';
// const female_av = 'https://res.cloudinary.com/geetika191099/image/upload/v1590345676/female_rz4tfg.png';
const UserSchema = mongoose.Schema({
    name : {
        type : String
    },
    email : {
        type : String
    },
    username : {
        type : String
    },
    password : {
        type : String
    },
    joined : {
        type : String
    },
    facebookId : {
        type : String
    },
    path_url : {
        type : String,
        default : 'https://res.cloudinary.com/geetika191099/image/upload/v1590345649/male_ee8mkx.jpg'
    },
    array_pic : {
        type : Array,
        'default' : ['https://res.cloudinary.com/geetika191099/image/upload/v1590345649/male_ee8mkx.jpg']
    },
    events : [{
        name : String,
        heading : String,
        value : String
    }]
    
});



const User = module.exports = mongoose.model('User' , UserSchema);

module.exports.getUserById = function(id,callback){
    User.findById(id,callback);
}

module.exports.getUserByEmailID = function(email, callback) {
    const query = {email : email}
    User.findOne(query, callback);
}

module.exports.getUserByUserName = function(username,callback){
    const query = {username : username}
    User.findOne(query,callback);
}

module.exports.getUser = function(username,email,callback) {
    const query = {$or:[{username: username},{ email : email}]}
    User.findOne(query , callback);
}

module.exports.getUserBoth = function(username,email,callback) {
    const query = {username: username ,  email : email}
    User.findOne(query , callback);
}

module.exports.addUser = function(newUser , callback){
   
    bcrypt.genSalt(10 , (err,salt) => {
        bcrypt.hash(newUser.password , salt ,(err,hash) =>{
            if(err) throw err;
            newUser.password = hash;

            newUser.save(callback);
        });
    });
}

module.exports.comparePassword = function(candidatePassword , hash , callback){
    bcrypt.compare(candidatePassword , hash , (err , isMatch) => {
        if(err) throw err;
        callback(null , isMatch);
    });
}
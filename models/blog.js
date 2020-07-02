const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');


const BlogSchema = mongoose.Schema({
    userid : {
        type: mongoose.Schema.Types.ObjectId,
		ref : 'User',
    },
    username : String,
    blogId : String,
    blog : {
        heading : String,
        description : String,
        created_on : String
    },
    comments : [{
        comName : String,
        comDes : String,
        postedOn : String
    }],
    likes : Number,
    made_on : String
})

const Blog = module.exports = mongoose.model('Blog' , BlogSchema);

module.exports.addBlog = function(newBlog , callback){
    console.log('saved');
   newBlog.save(callback);
}

module.exports.getBlogById = function(blogId,callback){
    const query = {blogId : blogId};
    Blog.findOne(query,callback);
}

module.exports.getAllBlogs = function(username,callback){
    const query = {username : username};
    Blog.find({username : username},callback).sort({made_on : -1});
}

module.exports.getFeedBlogs = function(callback){
    // const query = {username : username};
    Blog.find({},callback).sort({made_on : -1});
}

module.exports.updateLike = function(blog_id,callback) {
    const query = {_id : blog_id};
    Blog.findOne(query,callback);
}

module.exports.getUserByUserame = function(username,callback){
    const query = {username : username}
    Blog.findOne(query,callback);
}
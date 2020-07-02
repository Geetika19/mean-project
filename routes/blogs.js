const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const Blog = require('../models/blog');
const { v1: uuidv1 } = require('uuid');
var shortid = require('shortid');


router.post('/blog' ,(req,res) => {
    console.log(req.body.username);
    //console.log(req.body.blog);
    console.log(req.body.blogId);
    let newUser = new Blog({
        username : req.body.username,
        blog : req.body.blog,
        blogId : req.body.blogId,
        likes : req.body.likes,
        made_on : req.body.made_on
      });

    Blog.addBlog(newUser ,(err,blog) =>{
        if(err) throw err;
            else {
                console.log('blog table');
                Blog.getUserByUserame(newUser.username, (err,use) => {
                        if(err) throw err;
                        if(use){
                        //console.log(use);
                        res.json({ success : true , msg : 'Blog Added'});
                        return;
                    }
                        else{
                            console.log('Nope');
                            res.json({ success : false , msg : 'Blog Not Added'});
                            return;
                        }
                    })
                }});

})

router.post('/comment', (req,res) => {
    console.log("from comment" + req.body.blogId);
   
    comm = {comName : req.body.comName , comDes : req.body.comDes , postedOn : Date.now() };
    Blog.getBlogById(req.body.blogId , (err,blog) => {
        if(err) throw err;
        if(blog) {
            Blog.updateOne({blogId : req.body.blogId} , {$push : {comments : comm}} , function(err,result){
                if(err) throw err;
                else{
                    console.log('Comment Added');
                    
                   return  res.json({ success : true , msg : 'Added comment in db'});
                 }
            }).sort({postedOn :-1});
        }
    })
})

router.get('/profileBlogs' , passport.authenticate('jwt' , {session : false}), (req,res,next) => {
   
    const username = req.user.username;
    //console.log(username);
    var allBlogs;
    Blog.getAllBlogs(username ,(err,blogs) => {
        if(err) throw err;
        if(blogs){
            allBlogs = blogs;
            //console.log("now" + allBlogs)
            console.log("Added all blogs");
            return res.json({ blogs : allBlogs});
        }
    })

});


router.get('/profileAllBlogs' , passport.authenticate('jwt' , {session : false}), (req,res,next) => {
    const username = req.user.username;
    console.log(username);
    var allBlogs;
    Blog.getFeedBlogs((err,blogs) => {
        if(err) throw err;
        if(blogs){
            allBlogs = blogs;
            console.log("Added all blogs in feed");
            return res.json({ blogs : allBlogs});
        }
    })

});

router.get('/increase/:blogId' ,(req,res) => {

    var blogId = req.params.blogId;
    console.log(blogId);
    Blog.findOneAndUpdate({blogId : blogId} , {$inc : {'likes' : 1}},function (err , result) {
                if(err) throw err;
                else{
                   console.log('backend likes');
                  return  res.json({ success : true , msg : 'Likes Increased'});
                }
                })
     
    });


router.get('/decrease/:blogId' ,(req,res) => {

        var blogId = req.params.blogId;
        console.log(blogId);
        Blog.findOneAndUpdate({blogId : blogId} , {$inc : {'likes' : -1}},function (err , result) {
                    if(err) throw err;
                    else{
                      console.log('backend likes');
                      return  res.json({ success : true , msg : 'dislikes Increased'});
                    }
                    })
         
        });

    
   module.exports = router;
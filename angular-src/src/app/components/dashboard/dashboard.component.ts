import { Component, OnInit } from '@angular/core';
import { ValidateService} from '../../services/validate.service';
import { AuthService} from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import {Router} from '@angular/router';
import {formatDate } from '@angular/common';
import { v4 as uuidv4 } from 'uuid';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  config: any;
  username : String;
  blog : String;
  //  blog : [];
   heading : String;
   description : String;
   likes : Number;
   blogId : String;
   toggle : boolean = true;
   page:number = 1;
   comName : String;
   comDes : String;
   postedOn : String;
  //  created_on : String;
  //  made_on : String;
  
  // closeResult: string;
  public user : {name : '' , username : '' ,email : '' ,password : '' ,path_url : '',array_pic : '',likes:''};
  public blogs: [{username:'' , blog : '',likes : '',blogId : ''}];
  public comments : {comName: '',comDes : '',postedOn : ''};
  // public user : Object;
  constructor( 
    private validateService : ValidateService , 
    private flashMessage : FlashMessagesService ,
    private authService : AuthService,
    private router : Router,
    private modalService: NgbModal,
    
  )  {
    this.config = {
      itemsPerPage: 5,
      currentPage: 1
    };
   }
   pageChanged(event){
    this.config.currentPage = event;
  }
     



  ngOnInit(): void {
    this.authService.getProfile().subscribe(profile => {
      this.user = profile.user;
    },
    err => {
      console.log(err);
      return false;
    });


    this.authService.getAllBlogs().subscribe(blogs => {
      console.log("check" + blogs.blogs);
      this.blogs = blogs.blogs;
    },
    err => {
      console.log(err);
      return false;
    });
  }

  onCommentSubmit(blogId) {
    console.log(this.comDes);
    const comment = {
      blogId : blogId,
      comName : this.user.username,
      comDes : this.comDes,
      postedOn : formatDate(Date.now(), 'MMMM d,yyyy', 'en-US')
    }
    this.authService.insertComment(comment).subscribe(data => {
      if(data.success) {
        alert('Comment Successfully Added');
        this.flashMessage.show("Comment Posted" , { cssClass: 'alert-success' , timeout : 2000 });
        location.reload();
        this.authService.insertEvent(comment).subscribe(data => {
          // this.flashMessage.show("One Unread Notification" , { cssClass: 'alert-success' , timeout : 2000 });
          return true;
        })
        return true;
      }else {
        this.flashMessage.show("Unable to add comment" , { cssClass: 'alert-danger' , timeout : 2000 });
        return false;
      }
    })
  }

  onBlogSubmit() {
    // this.created_at = new Date(Date.now())
    const user2 = {
      username : this.user.username,
      blog : {heading : this.heading,
      description : this.description,
      created_on : formatDate(Date.now(), 'MMMM d,yyyy', 'en-US')},
      likes : 0,
      blogId : uuidv4(),
      made_on : Date.now()
    }
    console.log(user2.blog);
    this.authService.registerBlog(user2).subscribe(data => {
     
      if(data.success) {
        alert('Blog Successfully Added');
        this.flashMessage.show("Blog Added" , { cssClass: 'alert-success' , timeout : 2000 });
        location.reload();
        return true;
      }else {
        this.flashMessage.show("Unable to add blog" , { cssClass: 'alert-danger' , timeout : 2000 });
        return false;
      }
  });
  }

  onLike(blogId) {
    this.toggle=!this.toggle;
    this.blogId = blogId;
    // console.log(blogId);
    const entry = {
      blogId : blogId,
      likedBy : this.user.username
    }
    if(this.toggle == false){
    this.authService.increaseLike(blogId).subscribe(data => {
      if(data.success) {
         console.log('Increased Likes');
         this.authService.insertLike(entry).subscribe(data => {
            return true;
         })
         return true;
       }
    });
  }else {
    this.authService.decreaseLike(blogId).subscribe(data => {
      if(data.success) {
         console.log('Decreased Likes');
         return true;
       }
    });
  }
}

}

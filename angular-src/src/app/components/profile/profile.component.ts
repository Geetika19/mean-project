import { Component, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { FlashMessagesService } from 'angular2-flash-messages';
// import { NgxDropzoneModule } from 'ngx-dropzone';
// import { threadId } from 'worker_threads';
const URL = 'http://localhost:3000/upload';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements AfterViewInit {
  config : any;
  name : String ;
  username : String;
  email : String;
  cur_password : String ;
  value : boolean = true;
  new_password : String ;
  heading : String;
  blog : String;
  isDisabled() {
    return this.value;
  }
  
  @ViewChild('image1') image1: ElementRef;

  public user : {name : '' , username : '' ,email : '' ,password : '' ,path_url : '',array_pic : '' ,blogs :'',joined:'',events:''};
  public blogs : [{username:'' , blog : '',length:''}]
  // public user : Object;
  public uploader: FileUploader = new FileUploader({
    url: URL,
    itemAlias: 'image',
  });
  
  constructor(
    public authService : AuthService,
    private router : Router,
    private flashMessage : FlashMessagesService
    ) 
      {
        this.config = {
          itemsPerPage: 5,
          currentPage: 1
        };
       }
       pageChanged(event){
        this.config.currentPage = event;
      }
         
    

  ngAfterViewInit() : void{
    this.authService.getProfile().subscribe(profile => {
      this.user = profile.user;
    },
    err => {
      console.log(err);
      return false;
    });

    this.authService.getBlogs().subscribe(blogs => {
      console.log("uuuu" + blogs.blogs);
      this.blogs = blogs.blogs;
    },
    err => {
      console.log(err);
      return false;
    });
    
  

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
      file.url = file.url + "/" + this.user.email;
    };

    this.uploader.onCompleteItem = (item: any,response:any, status: any) => {
      console.log('Uploaded File Details:', item,status,response);
      alert('File uploaded successfully');
      location.reload();
    };

    this.uploader.onProgressItem = (fileItem: any, progress: any) => {
      this.uploader.progress = progress;
      console.log("fileitem : " + fileItem);
      console.log("progress : " + progress);
    };

  }

  public setAsProfilePic(email) {
    console.log("profile url : " + this.image1.nativeElement.src);
    // location.reload();
    const dp = {
      email : email,
      path_url : this.image1.nativeElement.src
    }

    this.authService.updatePath(dp).subscribe(data =>{
      if(data.success) {
        this.flashMessage.show("Dp Updated" , { cssClass: 'alert-success' , timeout : 10000 });
         console.log('dp changed');
         location.reload();
         return true;
       }
    });
  }

  
   public onUpdateSubmit(email) {
     const new_user = {
       email : email,
       name : this.name,
       new_password : this.new_password
     }
    
     console.log('heyyyy : ' + new_user.email + " passed email : " + email);
     this.authService.updateUser(new_user).subscribe(data => {
             if(data.success) {
              this.flashMessage.show("Details Updated" , { cssClass: 'alert-success' , timeout : 10000 });
               console.log('reached');
               location.reload();
               return true;
             }
       });
   }

   public checkIfPassIsValid(email) {
    const new_user1 = {
      email : email,
      cur_password : this.cur_password
    }
    console.log('wow');
    this.authService.checkPass(new_user1).subscribe(data => {
      var iDiv = document.getElementById('passwordMsg');
      if(data.success) {
        this.value  = false;
        if(document.getElementById("curpassDiv").classList.contains('has-danger')) {
           document.getElementById("curpassDiv").classList.remove('has-danger');
           document.getElementById("cur_password").classList.remove('is-invalid');
        }

        document.getElementById("curpassDiv").classList.add('has-success');
        document.getElementById("cur_password").classList.add('is-valid');
        iDiv.className = "valid-feedback";
        iDiv.innerHTML = "Correct Password";
      }else {
        this.value = true;
        if(document.getElementById("curpassDiv").classList.contains('has-success')) {
          document.getElementById("curpassDiv").classList.remove('has-success');
          document.getElementById("cur_password").classList.remove('is-valid');
        }

        document.getElementById("cur_password").classList.add('has-danger');
        document.getElementById("cur_password").classList.add('is-invalid');
        iDiv.className = "invalid-feedback";
        iDiv.innerHTML = "Incorrect Password";
      }
      
    });
  }
   

}

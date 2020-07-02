import { Component, OnInit } from '@angular/core';
import { ValidateService} from '../../services/validate.service';
import { AuthService} from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import {Router} from '@angular/router';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css','./bootstrap.css']
})
export class HomeComponent implements OnInit {
  textV : String;
  subject : String;
  // value : boolean = true;
  isDisabled() {
    return this.authService.loggedIn();
  }
  public user : {name : '' , username : '' ,email : '' ,password : '' ,path_url : '',array_pic : '',likes:''};
  public mail : {subject: '',textV : '',email,''};
  constructor( 
    private validateService : ValidateService , 
    private flashMessage : FlashMessagesService ,
    private authService : AuthService,
    private router : Router,
    private modalService: NgbModal,) { }

  ngOnInit(): void {
    this.authService.getProfile().subscribe(profile => {
      this.user = profile.user;
    },
    err => {
      console.log(err);
      return false;
    });

  }
  onContactSubmit(){
    // console.log(this.heading);
    // console.log(this.subject);
    // console.log(this.user.email);
    const mail = {
      subject: this.subject,
      textV : this.textV,
      email : this.user.email
    }
  
    this.authService.sendMail(mail).subscribe(data => {
      if(data.success) {
        alert('Mail Successfully Sent');
        this.flashMessage.show("Mail Successfully Sent" , { cssClass: 'alert-success' , timeout : 2000 });
        location.reload();
        return true;
      }else {
        this.flashMessage.show("Unable to send" , { cssClass: 'alert-danger' , timeout : 2000 });
        return false;
      }
    });
  }

  
}

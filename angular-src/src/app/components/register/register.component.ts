import { Component, OnInit } from '@angular/core';
import { ValidateService} from '../../services/validate.service';
import { AuthService} from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import {Router} from '@angular/router';
import {formatDate } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  name : String ;
  username : String;
  email : String;
  password : String ;
  joined : String;

  constructor(
    private validateService : ValidateService , 
    private flashMessage : FlashMessagesService ,
    private authService : AuthService,
    private router : Router
    ) { }

  ngOnInit(): void {
  }
 
  checkIfUsernameExists() {
    this.authService.checkUser(this.username).subscribe(data => {
      var iDiv = document.getElementById('usernameMsg');
      if(data.success && this.username != null) {
        
        if(document.getElementById("usernameDiv").classList.contains('has-danger')) {
           document.getElementById("usernameDiv").classList.remove('has-danger');
           document.getElementById("username").classList.remove('is-invalid');
        }

        document.getElementById("usernameDiv").classList.add('has-success');
        document.getElementById("username").classList.add('is-valid');
        iDiv.className = "valid-feedback";
        iDiv.innerHTML = "Success";
      }else {

        if(document.getElementById("usernameDiv").classList.contains('has-success')) {
          document.getElementById("usernameDiv").classList.remove('has-success');
          document.getElementById("username").classList.remove('is-valid');
        }

        document.getElementById("usernameDiv").classList.add('has-danger');
        document.getElementById("username").classList.add('is-invalid');
        iDiv.className = "invalid-feedback";
        iDiv.innerHTML = "Sorry, that username's taken. Try another?";
      }
      
    });
  }


  checkIfEmailIdExists() {
    this.authService.checkUserByEmail(this.email).subscribe(data => {
      var iDiv = document.getElementById('emailMsg');
      if(data.success && this.email != null && this.validateService.validateEmail(this.email)) {
        
        if(document.getElementById("emailDiv").classList.contains('has-danger')) {
           document.getElementById("emailDiv").classList.remove('has-danger');
           document.getElementById("email").classList.remove('is-invalid');
        }

        document.getElementById("emailDiv").classList.add('has-success');
        document.getElementById("email").classList.add('is-valid');
        iDiv.className = "valid-feedback";
        iDiv.innerHTML = "Success";
      }else {

        if(document.getElementById("emailDiv").classList.contains('has-success')) {
          document.getElementById("emailDiv").classList.remove('has-success');
          document.getElementById("email").classList.remove('is-valid');
        }

        document.getElementById("emailDiv").classList.add('has-danger');
        document.getElementById("email").classList.add('is-invalid');
        iDiv.className = "invalid-feedback";
        iDiv.innerHTML = "Sorry, that Email already exists or in Invalid. Try another?";
      }
      
    });
  }
  

  onRegisterSubmit() {
    const user = {
      name : this.name,
      email : this.email,
      username : this.username,
      password : this.password,
      joined : formatDate(Date.now(), 'MMMM d,yyyy', 'en-US')
 }
    //Require all filelds
    if(!this.validateService.validateRegister(user)) {
      this.flashMessage.show("Please fill in all the fields" , { cssClass: 'alert-danger' , timeout : 2000 });
      return false;
    }
    //checking valid email
    if(!this.validateService.validateEmail(user.email)) {
      this.flashMessage.show("Please Use a valid Email" , { cssClass: 'alert-danger' , timeout : 2000 });
      return false;
    }


   
    this.authService.registerUser(user).subscribe(data => {
        if(data.success) {
          this.flashMessage.show("You are now registered and can login" , { cssClass: 'alert-success' , timeout : 2000 });
          this.router.navigate(['/login']);
        }else {
          this.flashMessage.show(data.msg , { cssClass: 'alert-danger' , timeout : 2000 });
          this.router.navigate(['/register']);
        }
    });

  }

}

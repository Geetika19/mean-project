import { Injectable } from '@angular/core';
import { Http,Headers} from '@angular/http';
import { map } from 'rxjs/Operators';

import {tokenNotExpired} from 'angular2-jwt';
import { HttpModule } from '@angular/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authToken  : any;
  user : any;

  constructor(private http : Http) { }

  registerUser(user) {
    let headers = new Headers();
    headers.append('Content-Type' ,'application/json');
    return this.http.post('http://localhost:3000/users/register', user, {headers: headers})
      .pipe(map(res => res.json()));
  }

  registerBlog(user2) {
    let headers = new Headers();
    headers.append('Content-Type' ,'application/json');
    return this.http.post('http://localhost:3000/blogs/blog', user2, {headers: headers})
      .pipe(map(res => res.json()));
  }

  sendMail(mail) {
    // console.log("sending");
    let headers = new Headers();
    headers.append('Content-Type' ,'application/json');
    return this.http.post('http://localhost:3000/users/mail', mail, {headers: headers})
      .pipe(map(res => res.json()));
  }
  
  insertComment(comment) {
    let headers = new Headers();
    headers.append('Content-Type' ,'application/json');
    return this.http.post('http://localhost:3000/blogs/comment', comment , {headers: headers})
      .pipe(map(res => res.json()));
  }

  insertEvent(comment) {
    let headers = new Headers();
    headers.append('Content-Type' ,'application/json');
    return this.http.post('http://localhost:3000/users/event', comment , {headers: headers})
      .pipe(map(res => res.json()));
  }
   

  insertLike(entry) {
    let headers = new Headers();
    headers.append('Content-Type' ,'application/json');
    return this.http.post('http://localhost:3000/users/eventLike', entry , {headers: headers})
      .pipe(map(res => res.json()));
  }

  authenticateUser(user) {
    let headers = new Headers();
    headers.append('Content-Type' ,'application/json');
    return this.http.post('http://localhost:3000/users/authenticate', user, {headers: headers})
      .pipe(map(res => res.json()));
  }
  
  updateUser(newuser) {
    let headers = new Headers();
    headers.append('Content-Type' ,'application/json');
    return this.http.post('http://localhost:3000/users/update', newuser, {headers: headers})
      .pipe(map(res => res.json()));
  }

  updatePath(dp) {
    let headers = new Headers();
    headers.append('Content-Type' ,'application/json');
    return this.http.post('http://localhost:3000/users/updateDp', dp, {headers: headers})
      .pipe(map(res => res.json()));
  }


  checkUser(username) {
    let headers = new Headers();
    headers.append('Content-Type' ,'application/json');
    return this.http.get('http://localhost:3000/users/checkIfUserExists/'+username, {headers: headers})
      .pipe(map(res => res.json()));
  }

  checkUserByEmail(email) {
    let headers = new Headers();
    headers.append('Content-Type' ,'application/json');
    return this.http.get('http://localhost:3000/users/checkIfEmailExists/'+email, {headers: headers})
      .pipe(map(res => res.json()));
  }

  checkPass(newuser1) {
    let headers = new Headers();
    headers.append('Content-Type' ,'application/json');
    return this.http.post('http://localhost:3000/users/checkPassword', newuser1, {headers: headers})
      .pipe(map(res => res.json()));
  }
  
  increaseLike(blogId) {
    let headers = new Headers();
    headers.append('Content-Type' ,'application/json');
    return this.http.get('http://localhost:3000/blogs/increase/' + blogId, {headers: headers})
      .pipe(map(res => res.json()));
  }

  decreaseLike(blogId) {
    let headers = new Headers();
    headers.append('Content-Type' ,'application/json');
    return this.http.get('http://localhost:3000/blogs/decrease/' + blogId, {headers: headers})
      .pipe(map(res => res.json()));
  }



  getProfile() {
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization' , this.authToken);
    headers.append('Content-Type' ,'application/json');
    return this.http.get('http://localhost:3000/users/profile', {headers: headers})
      .pipe(map(res => res.json()));
  }

  getBlogs() {
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization' , this.authToken);
    headers.append('Content-Type' ,'application/json');
    return this.http.get('http://localhost:3000/blogs/profileBlogs', {headers: headers})
      .pipe(map(res => res.json()));
  }

  getAllBlogs() {
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization' , this.authToken);
    headers.append('Content-Type' ,'application/json');
    return this.http.get('http://localhost:3000/blogs/profileAllBlogs', {headers: headers})
      .pipe(map(res => res.json()));
  }

  storeUserData(token , user) {
    localStorage.setItem('id_token' , token);
    localStorage.setItem('user' , JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  loggedIn() {
    return tokenNotExpired('id_token');
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }
}

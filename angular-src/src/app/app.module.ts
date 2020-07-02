import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule , Routes} from '@angular/router';
import { FileUploadModule } from 'ng2-file-upload';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ValidateService } from './services/validate.service';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { AuthService } from './services/auth.service';
import { HttpModule } from '@angular/http';
import { AuthGuard} from './guards/auth.guard';
import { NgxDropzoneModule } from 'ngx-dropzone';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';

const appRoutes : Routes = [
  { path : '' , component : HomeComponent},
  { path : 'register' , component : RegisterComponent},
  { path : 'login' , component : LoginComponent},
  { path : 'dashboard' , component : DashboardComponent , canActivate : [AuthGuard]},
  { path : 'profile' , component : ProfileComponent , canActivate : [AuthGuard]}
]

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    DashboardComponent,
    ProfileComponent,
  ],
  imports: [
    HttpModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    FileUploadModule,
    RouterModule.forRoot(appRoutes),
    FlashMessagesModule.forRoot(),
    NgbModule,
    NgxPaginationModule
  ],
  providers: [ValidateService , AuthService , AuthGuard] ,
  bootstrap: [AppComponent]
})
export class AppModule { }

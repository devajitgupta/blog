import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup,ReactiveFormsModule } from '@angular/forms';
import {AccountserviceService} from '../accountservice.service';
import {Accountinfo} from '../accountinfo';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  regForm:any
  datasaved = false;
  massage!: string;
  constructor(private formbuilder: FormBuilder, private accountservice: AccountserviceService) { }

  ngOnInit() {
    this.setFormState();
  }
  setFormState(): void {
    this.regForm = this.formbuilder.group({
       name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  onSubmit() { 
    let userinfo = this.regForm.value;
    console.log(userinfo);
    this.createuserAccount(userinfo);
    this.regForm.reset();
  }
  createuserAccount(accinfo:Accountinfo) {
    this.accountservice.createaccount(accinfo).subscribe(
      () => {
       this.regForm.reset();
      }
    )
  }
}












































<section class="Singup-wrap mtb-40">
    <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-6">
              <div class="login-box">
                  <h1>User Registration</h1>
                  <div class="alert alert-success" *ngIf="datasaved">
                     {{massage}}
                  </div>
                  <form (click)="onSubmit()" [formGroup]="regForm">
                      
                      <div class="form-group form-row">
                          <label class="col-md-3">Name : <span class="required">*</span></label>
                          <div class="col-md-9">
                            <input type="text" formControlName="name" class="form-control" placeholder="Name" required="">
                          </div>
                      </div>
                  
                      <div class="form-group form-row">
                          <label class="col-md-3">Email ID <span class="required">*</span></label>
                          <div class="col-md-9">
                            <input type="text" formControlName="email" class="form-control" placeholder="Email Id" required="">
                          </div>
                      </div>
                      <div class="form-group form-row">
                          <label class="col-md-3">Password <span class="required">*</span></label>
                          <div class="col-md-9">
                            <input type="password" formControlName="password" class="form-control" placeholder="Password" required="">
                          </div>
                      </div>
                  
                      <div class="form-group">
                          <button type="submit" class="btn btn-primary">Submit</button>
                      </div>
                  </form>
              </div>         
          </div>
        </div>
       
    </div>
  </section>



























import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Accountinfo} from './accountinfo';
import {Userloginfo} from './userloginfo';

@Injectable({
  providedIn: 'root'
})
export class AccountserviceService {
  url='http://localhost:3000/'

  constructor(private http:HttpClient) { }

  
  createaccount(accinfo:Accountinfo):Observable<Accountinfo>{
   
    return this.http.post<Accountinfo>(this.url+'register',accinfo)
  }

  userlogin(logininfo:Userloginfo):Observable<Userloginfo>{
   
    return this.http.post<Userloginfo>(this.url+'login',logininfo)
  }
}






























//-----------------------------------routes
const express = require('express');
const User = require('../model/user.js');
const router = express.Router();
const bcrypt = require('bcrypt')
const mongoose = require('mongoose');
//const { async } = require('rxjs');
//const app=require('express')

// Connect to MongoDB using Mongoose
(async () => {
  try {
    await mongoose.connect('mongodb+srv://ajitgupta:ajitgupta@cluster0.qjitrd2.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
  }
})();

// Configure body-parser to handle POST requests

router.post("/login", function (req, res, next) {

  var email = req.body.email;
  User.find({ email: email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        res.status(200).json({
          msg: "Auth Failed",
          UserData: '',
          status: 'error'
        });
      } else {
        bcrypt.compare(req.body.password, user[0].password, function (err, result) {
          if (err) {
            res.json({
              msg: "Auth Failed",
              UserData: '',
              status: 'error'
            });
          }
          if (result) {
            res.status(200).json({
              msg: "User Login Successfully",
              UserData: user,
              status: 'success'
            });
          } else {
            res.json({
              msg: "Auth Failed",
              UserData: '',
              status: 'error'
            });
          }
        });

      }
    })
    .catch(err => {
      res.json({
        error: err
      });
    })


});
router.post('/', checkEmail, function (req, res, next) {

  console.log('post')

  bcrypt.hash(req.body.password, 10, function (err, hash) {

    if (err) {
      res.status(400).json({
        msg: "Something Wrong, Try Later!",
        results: err
      });
    } else {
      var userDetails = new User({
        name: req.body.name,
        email: req.body.email,
        password: hash,
        role: 'Author'

      });
      console.log(userDetails);
      userDetails.save().then(resResult => {
        res.status(201).json({
          msg: "Inserted Successfully",
          results: resResult
        });


      })
        .catch(err => {
          res.json(err);
        });
    }
  });
});

function checkEmail(req, res, next) {
  var email = req.body.email;
  var checkexitemail = User.findOne({ email: email });
  checkexitemail.exec((err, data) => {
    if (err) throw err;

    next();
  });
}


//console.log("user routes")
module.exports = router;

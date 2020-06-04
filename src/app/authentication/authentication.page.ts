import { take } from 'rxjs/operators';

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import {  AuthServiceService, AuthResponseData } from './auth-service.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';





@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.page.html',
  styleUrls: ['./authentication.page.scss'],
})
export class AuthenticationPage implements OnInit {
   islogin = true;
   isloading = false;


  form: FormGroup;
  constructor(private authService: AuthServiceService,
              private route: Router,
              private loadingCtrl: LoadingController
             ) { }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      username: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      })
    });
  }

  switchAuthentication() {
    if (this.islogin) {
      this.islogin = false;
    } else {
      this.islogin = true;
    }
  }


  authenticate() {
     this.isloading = true;
     this.loadingCtrl.create({
      keyboardClose: true,
      message: 'Login in'
    }).then(loadingE => {
      loadingE.present();
      let authObs: Observable<AuthResponseData>;
      if ( this.islogin) {
        authObs = this.authService.login(this.form.value.email, this.form.value.password);
      } else {
        authObs = this.authService.signup(this.form.value.email, this.form.value.password, this.form.value.username);
      }
      authObs.subscribe( resData => {
        console.log('Logged in user details', resData);
        setTimeout(() => {
          this.isloading = false;
          loadingE.dismiss();
          this.route.navigateByUrl('/home/explore/receipts');
          this.form.reset();
        }, 2000);
      });
    });
  }

}

import { ReceiptsServiceService } from './../home/explore/receipts/receipts-service.service';
import { take } from 'rxjs/operators';

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import {  AuthServiceService, AuthResponseData } from './auth-service.service';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';





@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.page.html',
  styleUrls: ['./authentication.page.scss'],
})
export class AuthenticationPage implements OnInit {
   islogin = true;
   isloading = false;
   letAuthenticate = false


  form: FormGroup;
  constructor(private authService: AuthServiceService,
              private router: Router,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private receiptService: ReceiptsServiceService
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
    this.loadingCtrl.create({
      keyboardClose: true,
      message: 'Logging'
    }).then(loadingEl => {
      loadingEl.present();
      let authObs: Observable<AuthResponseData>;
      if (this.islogin) {
        authObs = this.authService.login(this.form.value.email, this.form.value.password);
      } else {
        authObs = this.authService.signup(this.form.value.email, this.form.value.password, this.form.value.username);
      }

      authObs.subscribe(resData => {
        // Data received from the client
        console.log(resData);
        this.isloading = false;
        loadingEl.dismiss();
        this.router.navigateByUrl('/home/explore/receipts');
      }, 
      Error => {
        const code = Error.error.user.error[0];
        console.log('this is eerror', code);
        let message = 'Could not sign you up, please try again';
        if (code === 'A user with this email and password was not found.') {
          message = 'A user with this email and password was not found.Try again or signup.';
        } else if (code === 'An email address is required to log in.') {
          message = 'An email address is required to log in authentication';
        } else if (code === 'A password is required to log in') {
          message = 'A password is required to log in.';
        } else if (code === 'This user has been deactivated.') {
          message = 'This user has been deactivated.';
        }
        loadingEl.dismiss();
        this.showAlert(message);
        
      },
      // resError => {
      //  loadingEl.dismiss();
      //  const code_1 = resError.user;
      //  const code_2 = code_1.error;
      //  const code_3 = code_2[0];
      //  console.log('this is the errors', code_3);
      //  let message = 'Could not sign you up, please try again';
      //  if (code_3 === 'A user with this email and password was not found.') {
      //    message = 'A user with this email and password was not found.Try again or signup.';
      //  } else if (code_3 === 'An email address is required to log in.') {
      //    message = 'An email address is required to log in authentication';
      //  } else if (code_3 === 'A password is required to log in') {
      //    message = 'A password is required to log in.';
      //  } else if (code_3 === 'This user has been deactivated.') {
      //    message = 'This user has been deactivated.';
      //  }
      //  this.showAlert(message);
      // }
      
      );
    });
  }

  private showAlert(message: string) {
    this.alertCtrl.create({
      header: 'Authentication failed',
      // tslint:disable-next-line: object-literal-shorthand
      message: message,
      buttons: ['okay']
    }).then(alertEl => {
      alertEl.present();
    });
  }

  onLetsAuthenticate() {
    this.letAuthenticate = true;
  }


  // authenticate() {
  //    this.isloading = true;
  //    this.loadingCtrl.create({
  //     keyboardClose: true,
  //     message: 'Login in'
  //   }).then(loadingE => {
  //     loadingE.present();
  //     let authObs: Observable<AuthResponseData>;
  //     if ( this.islogin) {
  //       authObs = this.authService.login(this.form.value.email, this.form.value.password);
  //     } else {
  //       authObs = this.authService.signup(this.form.value.email, this.form.value.password, this.form.value.username);
  //     }
  //     authObs.subscribe( resData => {
  //       console.log('Logged in user details', resData);
  //       setTimeout(() => {
  //         this.isloading = false;
  //         loadingE.dismiss();
  //         this.route.navigateByUrl('/home/explore/receipts');
  //         this.form.reset();
  //       }, 2000);
  //     });
  //   });
  // }


}

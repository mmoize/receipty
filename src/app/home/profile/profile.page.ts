import { userProfileData } from './userProfileData.model';

import { AuthServiceService, AuthResponseData } from './../../authentication/auth-service.service';
import { ProfileserviceService } from './profileservice.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take, map, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { Plugins } from '@capacitor/core';
import { ReceiptsServiceService } from '../explore/receipts/receipts-service.service';




@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  // tslint:disable-next-line: variable-name
  userId;

  imageString;

  userReceiptCal;

  @Output() userProfileData = new EventEmitter<string>();

  public userProfile;

  constructor(private profileservice: ProfileserviceService,
              private authService: AuthServiceService,
              private receiptService: ReceiptsServiceService,
              private router: Router
              ) { }


  ngOnInit() {

  }

  doRefresh(event) {
    console.log('Begin async operation');

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }



  ionViewWillEnter() {
    this.authService.returnUserId().then(resData => {
      this.userId = resData;
      const tin = resData;
      console.log('the issue', resData);
      this.profileservice.loadUserProfile(tin).subscribe(resDatas => {
        this.userProfile = resDatas;
        this.imageString = this.userProfile.image;

        console.log(this.imageString);
        this.userProfileData.emit(resData);
      });
    });

    this.authService.userToken.subscribe(token => {
      const tokens = token;
      this.receiptService.userReceiptData(tokens).subscribe(resdata => {
        this.userReceiptCal = resdata;
        console.log('this itttt', this.userReceiptCal);
      });
    });

  }

  onclick() {
    this.router.navigateByUrl('/home/profile/profilesettings');
  }


}

import { userProfileData } from './userProfileData.model';

import { AuthServiceService, AuthResponseData } from './../../authentication/auth-service.service';
import { ProfileserviceService } from './profileservice.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take, map } from 'rxjs/operators';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { Plugins } from '@capacitor/core';




@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  // tslint:disable-next-line: variable-name
  userId;

  imageString;




  public userProfile;

  constructor(private profileservice: ProfileserviceService,
              private authService: AuthServiceService,
              private route: ActivatedRoute) { }


  ngOnInit() {

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
      });
    });
  }


}

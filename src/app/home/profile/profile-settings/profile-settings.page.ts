import { Component, OnInit} from '@angular/core';
import { ProfileserviceService } from '../profileservice.service';
import { AuthServiceService } from 'src/app/authentication/auth-service.service';
import { ReceiptsServiceService } from '../../explore/receipts/receipts-service.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.page.html',
  styleUrls: ['./profile-settings.page.scss'],
})


export class ProfileSettingsPage implements OnInit {

  userProfile;
  imageString;

  form: FormGroup;

  constructor(private profileservice: ProfileserviceService,
              private authService: AuthServiceService,
              private receiptService: ReceiptsServiceService,
              private router: Router,
              private loadingCtrl: LoadingController,
               ) { }

  public event = {
    month: '1990-02-19',
    timeStarts: '07:43',
    timeEnds: '1990-02-20'
  };

 colo = this.userProfile?.username;

  ngOnInit() {
    this.form = new FormGroup({
      username: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      f_name: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      l_name: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      city: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      country: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      bio: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
    });
  }

  ionViewWillEnter() {
    this.authService.returnUserId().then(resData => {
      const tin = resData;
      console.log('the issue', resData);
      this.profileservice.loadUserProfile(tin).subscribe(resDatas => {
        this.userProfile = resDatas;
        this.imageString = this.userProfile.image;

        console.log(this.imageString);
      });
    });
  }

  get formData() {
  const datas = new FormData();

  if ( this.form.value.username == null ) {
      datas.append('username', this.userProfile.username );
      // datas['username '] = this.userProfile.username;
    } else {
      datas.append('username', this.form.value.username );
      // datas['username'] = this.form.value.username;
    }

  if ( this.form.value.f_name == null ) {
      datas.append('f_name', this.userProfile.f_name);
      // datas['f_name '] = this.userProfile.f_name;
    } else {
      datas.append('f_name', this.form.value.f_name);
      // datas['f_name'] = this.form.value.f_name;
    }

  if ( this.form.value.l_name == null ) {
      datas.append('l_name ', this.userProfile.l_name);
      // datas['l_name '] = this.userProfile.l_name;
    } else {
      datas.append('l_name', this.form.value.l_name);
      // datas['l_name'] = this.form.value.l_name;
    }
  if ( this.form.value.city == null ) {
      datas.append('city', this.userProfile.city)
      // tslint:disable-next-line: no-string-literal
      // datas['city'] = this.userProfile.city;
    } else {
      datas.append('city', this.form.value.city);
      // datas['city'] = this.form.value.city;
    }

  if ( this.form.value.country == null ) {
      datas.append('country',  this.userProfile.country);
      // tslint:disable-next-line: no-string-literal
      // datas['country'] = this.userProfile.country;
    }  else {
      datas.append('country', this.form.value.country);
      // datas['country'] = this.form.value.country;
    }
  if ( this.form.value.bio == null ) {
      datas.append('bio', this.userProfile.bio);
      // datas['bio '] = this.userProfile.bio;
    } else {
      datas.append('bio', this.form.value.bio)
      // datas['bio'] = this.form.value.bio;
    }

  return datas;
  }

  onEdit() {

    console.log(this.formData);

    this.authService.userToken.subscribe(token => {
      const tokens = token;
      this.loadingCtrl.create({
        keyboardClose: true,
        message: 'Updating Profile..'
      }).then(loadEl => {
        loadEl.present();
        this.profileservice.UserProfileinfo(token, this.formData);
        setTimeout(() => {
          loadEl.dismiss();
          this.router.navigateByUrl('/home/profile');
        }, 5000);
      });
    });

  }

}

import { Component, OnInit} from '@angular/core';
import { ProfileserviceService } from '../profileservice.service';
import { AuthServiceService } from 'src/app/authentication/auth-service.service';
import { ReceiptsServiceService } from '../../explore/receipts/receipts-service.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingController, ActionSheetController } from '@ionic/angular';
import { Plugins, CameraSource, Camera, CameraResultType } from '@capacitor/core';


@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.page.html',
  styleUrls: ['./profile-settings.page.scss'],
})


export class ProfileSettingsPage implements OnInit {
  selectedImage;
  userProfile;
  imageString;
  postImage;
  postImageFormat;
  showImageAvatar = false;
  newImage = false;

  form: FormGroup;

  constructor(private profileservice: ProfileserviceService,
              private authService: AuthServiceService,
              private receiptService: ReceiptsServiceService,
              private router: Router,
              private loadingCtrl: LoadingController,
              private actionSheetCtrl: ActionSheetController
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
      image: new FormControl(null)
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
      datas.append('city', this.userProfile.city);
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
      datas.append('bio', this.form.value.bio);
      // datas['bio'] = this.form.value.bio;
    }
  if (this.form.value.image == null) {
    // datas.append('image', this.imageString );  // `myAvatar.${this.postImageFormat}`

  } else {
    datas.append('image', this.form.value.image, `myAvatar.${this.postImageFormat}`);
  }
  console.log( 'thisii  ny mima', this.form.value.image);
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


  async selectImageSource() {
    const buttons = [
      {
        text: 'Take Photo',
        icon: 'camera',
        handler: () => {
          this.addImage(CameraSource.Camera);
        }
      },
      {
        text: 'Choose From Photos Photo',
        icon: 'image',
        handler: () => {
          this.addImage(CameraSource.Photos);
        }
      }
    ];

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Select Image Source',
      buttons
    });
    await actionSheet.present();
  }

  async addImage(source: CameraSource) {
    const image = await Camera.getPhoto({
      quality: 60,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source
    });
    const urlCreator = window.URL || window.webkitURL;
    const blobData = this.getBlob(image.base64String);
    this.selectedImage = urlCreator.createObjectURL(blobData);
    const blobDatas = this.b64toBlob(image.base64String, `image/${image.format}`);
    this.postImageFormat = image.format;
    this.postImage = blobDatas;
    this.showImageAvatar = true;

  }

  onProceed() {
    this.showImageAvatar = false;
    this.newImage = true;
    this.form.patchValue({image: this.postImage});
  }

  // Helper function
  // https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
  b64toBlob(b64Data, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }


  getBlob(b64Data) {
    const contentType = '';
    const  sliceSize = 512;

    b64Data = b64Data.replace(/data\:image\/(jpeg|jpg|png)\;base64\,/gi, '');

    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }


}

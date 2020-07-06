import { RecentReceipt } from './recentReceipt.model';
import { ViewimageComponent } from './../../../shared/viewimage/viewimage.component';
import { switchMap } from 'rxjs/operators';
import { DashboardsPage } from './../../dashboards/dashboards.page';
import { ReceiptsServiceService } from './receipts-service.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { CaptureReceiptsComponent } from './../../../shared/capture-receipts/capture-receipts.component';
import { ProfileserviceService } from './../../profile/profileservice.service';
import { Router } from '@angular/router';
import { AuthServiceService } from './../../../authentication/auth-service.service';
import { Component, OnInit, OnDestroy, Output, ViewChild, EventEmitter, ElementRef } from '@angular/core';
import { Subscription, BehaviorSubject, Observable } from 'rxjs';
import { ActionSheetController, Platform, ModalController, LoadingController } from '@ionic/angular';
import { Capacitor, Plugins, CameraSource, CameraResultType, FilesystemDirectory, Camera, } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RecentReceiptsComponent } from 'src/app/shared/recent-receipts/recent-receipts.component';



interface Photo {
  filepath: string;
  webviewPath: string;
  base64?: string;
}

@Component({
  selector: 'app-receipts',
  templateUrl: './receipts.page.html',
  styleUrls: ['./receipts.page.scss'],
})
export class ReceiptsPage implements OnInit, OnDestroy {
  constructor(private authService: AuthServiceService,
              private router: Router,
              private platform: Platform,
              private modalCtrl: ModalController,
              private actionSheetCtrl: ActionSheetController,
              private receiptService: ReceiptsServiceService,
              private profileService: ProfileserviceService,
              private loadingCtrl: LoadingController,
              private sanitizer: DomSanitizer
              ) { }

  @ViewChild('filePicker', {static: false}) filePickeRef: ElementRef<HTMLInputElement>;

  @Output() imagePick = new EventEmitter<string>();
  selectedImage;
  usePicker = false;
  showImageReceipt = false;
  postImageFormat;
  userReceipts;
  public photos: Photo[];
  newkeys = [];

  postImage;
  form: FormGroup;
  // tslint:disable-next-line: variable-name
  _userToken;

  receiptsData = [];
  receiptsSub: Subscription;
  private authSub: Subscription;
  private previousAuthState = false;




  customActionSheetOptions: any = {
    header: 'Categories',
    subHeader: 'Select your category'
  };


    slideOpts = {
      on: {
        beforeInit() {
          const swiper = this;
          swiper.classNames.push(`${swiper.params.containerModifierClass}fade`);
          const overwriteParams = {
            slidesPerView: 1,
            slidesPerColumn: 1,
            slidesPerGroup: 1,
            watchSlidesProgress: true,
            spaceBetween: 0,
            virtualTranslate: true,
          };
          swiper.params = Object.assign(swiper.params, overwriteParams);
          swiper.params = Object.assign(swiper.originalParams, overwriteParams);
        },
        setTranslate() {
          const swiper = this;
          const { slides } = swiper;
          for (let i = 0; i < slides.length; i += 1) {
            const $slideEl = swiper.slides.eq(i);
            const offset$$1 = $slideEl[0].swiperSlideOffset;
            let tx = -offset$$1;
            if (!swiper.params.virtualTranslate) { tx -= swiper.translate; }
            let ty = 0;
            if (!swiper.isHorizontal()) {
              ty = tx;
              tx = 0;
            }
            const slideOpacity = swiper.params.fadeEffect.crossFade
              ? Math.max(1 - Math.abs($slideEl[0].progress), 0)
              : 1 + Math.min(Math.max($slideEl[0].progress, -1), 0);
            $slideEl
              .css({
                opacity: slideOpacity,
              })
              .transform(`translate3d(${tx}px, ${ty}px, 0px)`);
          }
        },
        setTransition(duration) {
          const swiper = this;
          const { slides, $wrapperEl } = swiper;
          slides.transition(duration);
          if (swiper.params.virtualTranslate && duration !== 0) {
            let eventTriggered = false;
            slides.transitionEnd(() => {
              if (eventTriggered) { return; }
              if (!swiper || swiper.destroyed) { return; }
              eventTriggered = true;
              swiper.animating = false;
              const triggerEvents = ['webkitTransitionEnd', 'transitionend'];
              // tslint:disable-next-line: prefer-for-of
              for (let i = 0; i < triggerEvents.length; i += 1) {
                $wrapperEl.trigger(triggerEvents[i]);
              }
            });
          }
        },
      }
    };


  ngOnInit() {

    this.form = new FormGroup({
      total_spending: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      category: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      })

    });

    if (this.platform.is('mobile') && !this.platform.is('hybrid') || this.platform.is('desktop')) {
      this.usePicker = true;
    }

    this.authSub = this.authService.userIsAuthenticated.subscribe(isAuth => {
      if (!isAuth && this.previousAuthState !== isAuth) {
        this.router.navigateByUrl('/auth');
      }
      this.previousAuthState = isAuth;
    });
  }

  ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }

  onlogout() {
    this.authService.logout();
    this.profileService.clearProfile();
    console.log('logged out');
  }

  onImagePicked(imageData: string) {

  }

  onPickImage() {
    this.actionSheetCtrl.create({
      header: 'please Choose',
      buttons: [
        {text: 'Take Picture', handler: () => {
          this.captureImage();
           // this.openCapturedReceiptModal();
        }},
        {text: 'Choose from device', handler: () => {
            //this.getimage();
          this.filePickeRef.nativeElement.click();
        }},
        {text: 'Cancel', role: 'cancel'}
      ]
    }).then(actionSheetEl => {
        actionSheetEl.present();
    });
  }
  private captureImage() {
    if (!Capacitor.isPluginAvailable('Camera')) {
     // this.filePickeRef.nativeElement.click();
      return;
    }
    Plugins.Camera.getPhoto({
      quality: 100,
      source: CameraSource.Camera,
      correctOrientation: true,
      saveToGallery: true,
      // allowEditing: true,
      // height: 500,
      width: 700,
      // resultType: CameraResultType.Base64
      resultType: CameraResultType.Base64,
    }).then(image => {
        // tslint:disable-next-line: prefer-const
        let urlCreator = window.URL || window.webkitURL;
        const blobDatas = this.b64toBlob(image.base64String, `image/${image.format}`);
        this.postImageFormat = image.format;
        const blobData = this.getBlob(image.base64String);
        this.postImage = blobDatas;
        console.log('this is your image', blobData);
        const imageName = 'receipt';
        this.selectedImage = urlCreator.createObjectURL(blobData);
        // this.selectedImage = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.dataUrl));
        this.showImageReceipt = true;

    }).catch(error => { // this part collects errors.
      console.log(error);
      if (this.usePicker) {
        this.filePickeRef.nativeElement.click();
      }
      return false;
    });
  }

  oncloseReceiptCapture() {
    this.showImageReceipt = false;
  }

  private getimage() {
    if (!Capacitor.isPluginAvailable('Camera')) {
     // this.filePickeRef.nativeElement.click();
      return;
    }
    Plugins.Camera.getPhoto({
      quality: 100,
      source: CameraSource.Photos,
      correctOrientation: true,
      saveToGallery: true,
      // allowEditing: true,
      // height: 500,
      // width: 700,
      // resultType: CameraResultType.Base64
      resultType: CameraResultType.Base64,
    }).then(image => {
        // tslint:disable-next-line: prefer-const
        let urlCreator = window.URL || window.webkitURL;
        const blobDatas = this.b64toBlob(image.base64String, `image/${image.format}`);
        this.postImageFormat = image.format;
        const blobData = this.getBlob(image.base64String);
        this.postImage = blobDatas;
        console.log('this is your image', blobData);
        const imageName = 'receipt';
        this.selectedImage = urlCreator.createObjectURL(blobData);
        // this.selectedImage = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.dataUrl));
        this.showImageReceipt = true;

    }).catch(error => { // this part collects errors.
      console.log(error);
      if (this.usePicker) {
        this.filePickeRef.nativeElement.click();
      }
      return false;
    });
  }

  onFileChosen(event: Event) {
    const pickedFile = (event.target as HTMLInputElement).files[0];
    this.selectedImage = pickedFile;

    if (!pickedFile) {
      return;
    }

    const fR = new FileReader();

    fR.onload = () => {
      const dataUrl = fR.result.toString();
      this.selectedImage = dataUrl;
      this.showImageReceipt = true;
    };
    fR.readAsDataURL(pickedFile);
 }


 openCapturedReceiptModal() {
   this.modalCtrl.create({
     component: RecentReceiptsComponent,
     componentProps: {selectedImage: this.selectedImage}
   }).then(modalEl => {
     modalEl.present();
     return;
   });
 }

 onProceed() {
    this.authService.userToken.subscribe(token => {
      this._userToken = token;
    });
    this.loadingCtrl.create({keyboardClose: true, message: 'Uploading your receipt..'})
    .then(loadingEl => {
      loadingEl.present();
      const imageFormat = this.postImageFormat;
      const image = this.postImage;
      this.receiptService.uplaodUserReceipt(image, imageFormat, this.form.value.total_spending, this.form.value.category, this._userToken);
      this.showImageReceipt = false;
      setTimeout(() => {
        loadingEl.dismiss();
      }, 4000);
    });
    this.receiptsData = [];
    setTimeout(() => {
      this.receiptService.loadUserRecentReceipts().subscribe(() => {});
      this.addSvg();
    }, 4000);

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

  ionViewWillLeave() {
   this.receiptsData = [];
  }

  ionViewWillEnter() {
    setTimeout(() => {
      this.receiptService.loadUserRecentReceipts().subscribe(() => {});
      this.addSvg();
    }, 2000);

    this.authService.userToken.subscribe(token => {
      const tokens = token;
    });

    this.receiptService.loadUserRecentReceipts().subscribe(() => {
      // something here
    });
    this.receiptsSub = this.receiptService.recentReceipts.subscribe(resData => {
      this.userReceipts = resData;
      console.log('Moooosa', this.userReceipts);
    });
  }

  // adding SVG icons on the recent posts
  addSvg() {

    for (const key in this.userReceipts) {
      if (this.userReceipts.hasOwnProperty(key)) {
          const receipty = [];
        if (this.userReceipts[key].category === 'Health') {
             const icons = 'assets/icon/Health.svg';
             receipty.push( new RecentReceipt (
                 this.userReceipts[key].pk,
                this.userReceipts[key].category,
                this.userReceipts[key].total_spending,
                this.userReceipts[key].created_at,
                this.userReceipts[key].receipt_image_set,
                icons

             ),

          );
        } else {
          //
        // tslint:disable-next-line: align
        } if (this.userReceipts[key].category === 'Education') {
            const icons = 'assets/icon/Education.svg';
            receipty.push( new RecentReceipt (
              this.userReceipts[key].pk,
             this.userReceipts[key].category,
             this.userReceipts[key].total_spending,
             this.userReceipts[key].created_at,
             this.userReceipts[key].receipt_image_set,
             icons
          ),

       );
        } else {
          //
        }
          if (this.userReceipts[key].category === 'Groceries') {
              const icons = 'assets/icon/grocery-cart.svg';
              receipty.push( new RecentReceipt (
              this.userReceipts[key].pk,
              this.userReceipts[key].category,
              this.userReceipts[key].total_spending,
              this.userReceipts[key].created_at,
              this.userReceipts[key].receipt_image_set,
              icons
            ),
          );
      } else {
        //
      }
          if (this.userReceipts[key].category === 'Home') {
              const icons = 'assets/icon/home.svg';

              receipty.push( new RecentReceipt (
              this.userReceipts[key].pk,
              this.userReceipts[key].category,
              this.userReceipts[key].total_spending,
              this.userReceipts[key].created_at,
              this.userReceipts[key].receipt_image_set,
              icons
            ),
         );
    } else {
      //
    }
          if (this.userReceipts[key].category === 'shopping') {
      const icons = 'assets/icon/shopping.svg';
      receipty.push( new RecentReceipt (
              this.userReceipts[key].pk,
              this.userReceipts[key].category,
              this.userReceipts[key].total_spending,
              this.userReceipts[key].created_at,
              this.userReceipts[key].receipt_image_set,
              icons
            ),
        );
    } else {
      //
    }
          if (this.userReceipts[key].category === 'Transport') {
        const icons = 'assets/icon/transport.svg';
        receipty.push( new RecentReceipt (
          this.userReceipts[key].pk,
          this.userReceipts[key].category,
          this.userReceipts[key].total_spending,
          this.userReceipts[key].created_at,
          this.userReceipts[key].receipt_image_set,
          icons
        ),
      );
    } else {
      //
    }
          if (this.userReceipts[key].category === 'Utilities') {
          const icons = 'assets/icon/tool-belt.svg';
          receipty.push( new RecentReceipt (
            this.userReceipts[key].pk,
            this.userReceipts[key].category,
            this.userReceipts[key].total_spending,
            this.userReceipts[key].created_at,
            this.userReceipts[key].receipt_image_set,
            icons
          ),
        );
    } else {
      //
    }
          if (this.userReceipts[key].category === 'Food') {
          const icons = 'assets/icon/Food.svg';
          receipty.push( new RecentReceipt (
            this.userReceipts[key].pk,
            this.userReceipts[key].category,
            this.userReceipts[key].total_spending,
            this.userReceipts[key].created_at,
            this.userReceipts[key].receipt_image_set,
            icons
          ),
        );
    } else {
      //
    }
          if (this.userReceipts[key].category === 'Travel') {
        const icons = 'assets/icon/Travel.svg';
        receipty.push( new RecentReceipt (
          this.userReceipts[key].pk,
          this.userReceipts[key].category,
          this.userReceipts[key].total_spending,
          this.userReceipts[key].created_at,
          this.userReceipts[key].receipt_image_set,
          icons
        ),
      );
    } else {
      //
    }
          if (this.userReceipts[key].category === 'Entertainment') {
          const icons = 'assets/icon/Entertainment.svg';
          receipty.push( new RecentReceipt (
            this.userReceipts[key].pk,
            this.userReceipts[key].category,
            this.userReceipts[key].total_spending,
            this.userReceipts[key].created_at,
            this.userReceipts[key].receipt_image_set,
            icons
          ),
        );
    } else {
      //
    }
          if (this.userReceipts[key].category === 'Other') {
          const icons = 'assets/icon/other.svg';
          receipty.push( new RecentReceipt (
            this.userReceipts[key].pk,
            this.userReceipts[key].category,
            this.userReceipts[key].total_spending,
            this.userReceipts[key].created_at,
            this.userReceipts[key].receipt_image_set,
            icons
          ),
        );
    } else {
    //
    }
          this.receiptsData.push(receipty);

        }
    }
  }

  openViewImageModal(data) {
    this.modalCtrl.create({
      component: RecentReceiptsComponent,
      componentProps: {userRecentReceipt: data}
    }).then(modalEl => {
       modalEl.present();
       return modalEl.onDidDismiss();
    });
  }


  onRemove(Pk) {
     const xData = [];
    // tslint:disable-next-line: forin
     for (const key in this.receiptsData) {

       if (this.receiptsData[key][0].pk === Pk) {
           //
       } else {
        this.newkeys.push( [this.receiptsData[key][0]]);
       }

    }

     xData.push(this.newkeys);
     const newData = this.receiptsData;
     const refreshedData = this.newkeys.filter(x => x.pk !== Pk);
     this.receiptsData = refreshedData;
     this.newkeys = [];
  }





}

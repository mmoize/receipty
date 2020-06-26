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

function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = window.atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, {type: contentType});
}

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

  @ViewChild('filePicker', {static: false}) filePickeRef: ElementRef<HTMLInputElement>;

  @Output() imagePick = new EventEmitter<string>();
  selectedImage: SafeResourceUrl;
  usePicker = false;
  showImageReceipt = false;

  public photos: Photo[];

  postImage;
  form: FormGroup;
  // tslint:disable-next-line: variable-name
  _userToken;
  constructor(private authService: AuthServiceService,
              private router: Router,
              private platform: Platform,
              private modalCtrl: ModalController,
              private actionSheetCtrl: ActionSheetController,
              private receiptService: ReceiptsServiceService,
              private profileService: ProfileserviceService,
              private loadingCtrl: LoadingController,
              private dashboard: DashboardsPage,
              private sanitizer: DomSanitizer
              ) { }


  private authSub: Subscription;
  private previousAuthState = false;


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
           //this.openCapturedReceiptModal();
        }},
        {text: 'Choose from device', handler: () => {
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
      quality: 70,
      source: CameraSource.Prompt,
      correctOrientation: true,
      saveToGallery: true,
      height: 320,
      width: 200,
      // resultType: CameraResultType.Base64
      resultType: CameraResultType.DataUrl,
    }).then(image => {
        // const imageData = image.base64String;
        // onst blob = base64toBlob(imageData, 'image/jpg');
        this.selectedImage = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.base64String));
        
        // let imageFile;
        // if (typeof imageData === 'string') {
        //   try {
        //     imageFile =  base64toBlob(
        //       imageData.replace('data:image/jpeg;base64,',
        //     ''), 'image/jpeg');
        //   } catch (error) {
        //     console.log(error);
        //     return;
        //   }
        // } else {
        //   imageFile = ImageData;
        // }
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
     component: CaptureReceiptsComponent,
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
      const image = this.selectedImage;
      this.receiptService.uplaodUserReceipt(image, this.form.value.total_spending, this.form.value.category, this._userToken);
      this.showImageReceipt = false;
      setTimeout(() => {
        loadingEl.dismiss();
        this.dashboard.loadReceipts();
      }, 5000);
    });
 }

 public async addNewToGallery() {
  // Take a photo
  const capturedPhoto = await Camera.getPhoto({
    resultType: CameraResultType.Uri, 
    source: CameraSource.Camera, 
    quality: 90
  });
  
  this.photos.unshift({
    filepath: "soon...",
    webviewPath: capturedPhoto.webPath
  });
  this.showImageReceipt = true;

}









}

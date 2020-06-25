import { switchMap, take } from 'rxjs/operators';
import { AuthServiceService } from './../../authentication/auth-service.service';
import { ReceiptsServiceService } from './../explore/receipts/receipts-service.service';
import { Component, OnInit, Injectable } from '@angular/core';
import { Receipt } from '../explore/receipts/receipts.model';
import { SegmentChangeEventDetail } from '@ionic/core';
import { ModalController } from '@ionic/angular';
import { ViewimageComponent } from 'src/app/shared/viewimage/viewimage.component';
import { Subscription } from 'rxjs';
import { ReceiptDataCal } from '../explore/receipts/receiptDataCal.model';

@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.page.html',
  styleUrls: ['./dashboards.page.scss'],
})

@Injectable({
  providedIn: 'root'
})
export class DashboardsPage implements OnInit {

  public userReceipts = [];
  userReceiptCal;
  userImage = [];
  colo;
  userToken;
  private receiptsCal: Subscription;
  private receiptsSub: Subscription;

  constructor(private receiptService: ReceiptsServiceService,
              private authService: AuthServiceService,
              private modalCtrl: ModalController,
              ) { }

  ngOnInit() {


  }



  ionViewWillEnter() {
    this.authService.userToken.subscribe(token => {
      const tokens = token;
      this.receiptService.userReceiptData(tokens).subscribe(resdata => {
        this.userReceiptCal = resdata;
        console.log('this itttt', this.userReceiptCal);
      });
    });

    this.receiptService.loadUserReceipts().subscribe(() => {
      // something here
    });
    this.receiptsSub = this.receiptService.Receipts.subscribe(resData => {
      this.userReceipts = resData;
    });


  }


  loadReceipts() {


    // this.receiptService.loadedReceipts().then(resData => {
    //   this.colo = resData;
    //   console.log('this is a key-resData', this.colo);
    //   this.userReceipts = resData;
    //   console.log('this is userReceipt..//', this.userReceipts);
    //   let colos = [];
    //   colos = this.userReceipts;
    //   // iterate of the list userReceipts
    //   for (const key of colos) {
    //       console.log('this is key of colos ..', key);
    //   }
    // });

  }


  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    if (event.detail.value === 'all') {
      // do nothing
    } else {
      this.userReceipts = [''];
    }
  }

  openViewimageModal(Receipt) {
    this.modalCtrl.create({
      component: ViewimageComponent,
      componentProps: {userReceipt: Receipt}
    }).then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    });
  }


}

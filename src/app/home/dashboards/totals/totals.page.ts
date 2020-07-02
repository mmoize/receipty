import { Router } from '@angular/router';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Component, OnInit } from '@angular/core';
import { ReceiptsServiceService } from '../../explore/receipts/receipts-service.service';
import { AuthServiceService } from 'src/app/authentication/auth-service.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-totals',
  templateUrl: './totals.page.html',
  styleUrls: ['./totals.page.scss'],
})
export class TotalsPage implements OnInit {
  constructor( private receiptService: ReceiptsServiceService,
               private authService: AuthServiceService,
               private modalCtrl: ModalController,
               private route: Router
              ) { }
  userReceiptCal;
  dashboardSegment = true;
  receiptViewSegment = false;
  savedviewSegment = false;



  ngOnInit() {

  }

  ionViewWillEnter() {
   this.loadUpStats();
  }

  loadUpStats() {
    this.authService.userToken.subscribe(token => {
      const tokens = token;
      this.receiptService.userReceiptData(tokens).subscribe(resData => {
        this.userReceiptCal = resData; // user receipts stats
      });
    });
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
      console.log(event.detail);
      if (event.detail.value === 'dashboard') {
          this.dashboardSegment = true;
      } else {
        this.dashboardSegment = false;
      }
      if (event.detail.value === 'analytics') {
         this.receiptViewSegment = true;
         this.route.navigateByUrl('/home/totals-detail');
         this.dashboardSegment = true
      } else {
        this.receiptViewSegment = false;
      }
      // if (event.detail.value === 'saved') {
      //    this.savedviewSegment = true;
      // } else {
      //   this.savedviewSegment = false;
      // }
    }

}

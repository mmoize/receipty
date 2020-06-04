import { AuthServiceService } from './../../authentication/auth-service.service';
import { ReceiptsServiceService } from './../explore/receipts/receipts-service.service';
import { Component, OnInit } from '@angular/core';
import { Receipt } from '../explore/receipts/receipts.model';
import { SegmentChangeEventDetail } from '@ionic/core';

@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.page.html',
  styleUrls: ['./dashboards.page.scss'],
})
export class DashboardsPage implements OnInit {

  public userReceipts = [];
  userImage = [];
  constructor(private receiptService: ReceiptsServiceService,
              private authService: AuthServiceService
              ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
  this.loadReceipts();
  }

  loadReceipts() {
    this.authService.returnUserToken().then(resultData => {
      const userToken = resultData;
      this.receiptService.loadUserReceipts(userToken);
    });
  }

  ionViewDidEnter() {
    this.receiptService.loadedReceipts().then(resData => {
      const colo = [];

      console.log('this is a key', colo );
      this.userReceipts = resData;
      console.log('this is userReceipt..', this.userReceipts);
      let colos = [];
      colos = this.userReceipts;
      // iterate of the list userReceipts
      for (const key of colos) {
          console.log('this is key of colos ..', key);
      }
    });
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    if (event.detail.value === 'all') {
      // do nothing
    } else {
      this.userReceipts = [''];
    }
  }

}

import { ReceiptsServiceService } from './../../home/explore/receipts/receipts-service.service';
import { Component, OnInit, Input } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-recent-receipts',
  templateUrl: './recent-receipts.component.html',
  styleUrls: ['./recent-receipts.component.scss'],
})
export class RecentReceiptsComponent implements OnInit {
  @Input() userRecentReceipt;
  theSelectedReceipt;
  constructor(private modalCtrl: ModalController,
              private receiptService: ReceiptsServiceService,
              private loadingCtrl: LoadingController,
              ) { }

  ngOnInit() {}


  ionViewWillEnter() {
   this.theSelectedReceipt = this. userRecentReceipt;
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }

  onDelete(pk) {
    this.loadingCtrl.create({ message: 'Deleting your Receipt'}).then(loadingEl => {
      loadingEl.present();
      this.receiptService.deleteReceipt(pk);
      this.modalCtrl.dismiss();

      setTimeout(() => {
       this.receiptService.loadUserReceipts().subscribe(() => {});
       loadingEl.dismiss();
     }, 4000);
    });


   }


}

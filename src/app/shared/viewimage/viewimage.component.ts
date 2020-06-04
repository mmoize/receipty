import { ReceiptsServiceService } from './../../home/explore/receipts/receipts-service.service';
import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-viewimage',
  templateUrl: './viewimage.component.html',
  styleUrls: ['./viewimage.component.scss'],
})
export class ViewimageComponent implements OnInit {

  @Input() userReceipt;
  theSelectedReceipt;
  constructor(private modalCtrl: ModalController,
              private receiptService: ReceiptsServiceService
              ) { }

  ngOnInit() {}

  ionViewWillEnter() {
    this.theSelectedReceipt = this.userReceipt;
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }

  onDelete(pk) {
   this.receiptService.deleteReceipt(pk);
  }

}

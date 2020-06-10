import { ReceiptsServiceService } from './../../home/explore/receipts/receipts-service.service';
import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ReceiptImage } from './ReceiptImage.model';

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


@Component({
  selector: 'app-viewimage',
  templateUrl: './viewimage.component.html',
  styleUrls: ['./viewimage.component.scss'],
})
export class ViewimageComponent implements OnInit {

  @Input() userReceipt;
  theSelectedReceipt;

  public images: ReceiptImage[] = [];
  

  constructor(private modalCtrl: ModalController,
              private receiptService: ReceiptsServiceService,
              private storage: Storage
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



 private toDataUrl(url) {
 return  fetch(url)
  .then(results => results.blob())
  .then(blob => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  }));
 }

   // save the image file to the device's storage

  onSaveReceipt(imageUrl) {
    this.toDataUrl(imageUrl).then(results => {
      console.log('Results: ', results);
      this.saveReceipt(results);
    });
    this.tester = false
  }


  saveReceipt(data) {

   this.storage.set('ReceiptImages', data);

   this.storage.get('ReceiptImages').then((imagess) => {
     this.images = imagess || [];
     console.log('this is the saved image', this.images);
   });
  }


  tester = false;



}

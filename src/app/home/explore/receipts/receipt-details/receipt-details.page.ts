import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-receipt-details',
  templateUrl: './receipt-details.page.html',
  styleUrls: ['./receipt-details.page.scss'],
})
export class ReceiptDetailsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  // async addImage(source: CameraSource) {
  //   const image = await Camera.getPhoto({
  //     quality: 60,
  //     allowEditing: true,
  //     resultType: CameraResultType.Base64,
  //     source
  //   });
 
  //   const blobData = this.b64toBlob(image.base64String, `image/${image.format}`);
  //   const imageName = 'Give me a name';
 
  //   this.api.uploadImage(blobData, imageName, image.format).subscribe((newImage: ApiImage) => {
  //     this.images.push(newImage);
  //   });
  // }

}

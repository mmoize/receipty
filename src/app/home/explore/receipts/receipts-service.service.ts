

import { AuthServiceService } from './../../../authentication/auth-service.service';
import { tap } from 'rxjs/operators';
import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Receipt } from './receipts.model';
import { Plugins } from '@capacitor/core';




export interface ReceiptData {
 id: string;
 image: string;
 user: string;

}

@Injectable({
  providedIn: 'root'
})
export class ReceiptsServiceService implements OnInit {

  userReceipts = [];
  handler;
  xhr;
  constructor(private http: HttpClient, private authService: AuthServiceService) { }

  private _userReceipts = new BehaviorSubject<any>(null);

  baseUrl = 'https://fleeks.herokuapp.com/api/receipt_image/';
  postBaseurl = 'https://fleeks.herokuapp.com/api/receipts/';

  ngOnInit() {
  }

  loadUserReceipts(userToken) {
    const nads = [];
    console.log('this is the user', userToken);
    return this.http.get<any>(this.baseUrl, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token ' +  userToken,
      }
    }).subscribe(results => {
      console.log('AAA the result', results);
      const userData = [];
      const another = [];

      this.setReceiptData(nads);
      const jala = [];
      for (const keys of nads) {
        jala.push({
          key: 'id',
          value:  keys[0].id
        });
        jala.push({
          key: 'image',
          value:  keys[0].image
        });
        jala.push({
          key: 'user',
          value:  keys[0].user
        });
      }
      console.log('this is jalala', jala);

      const imo = [];
      const coco = [];
      for (const key of jala) {
        coco.push(key);
      }
      for (const key of coco) {
        if (key.key === 'image') {
          imo.push(key.value);
        }

      }
      console.log('returning the images frm srvice..', imo);
      this.userReceipts.push(results);
    });

  }


 setReceiptData(receiptData) {
    const rawData = JSON.stringify(receiptData);
    const parsedData = JSON.parse(rawData);
    const theId = parsedData.id;
    const theImage = parsedData.image;
    const theUser = parsedData.user;
    // tslint:disable-next-line: variable-name
    const userReceipt_Data = new Receipt(
      receiptData.id = theId,
      receiptData.image = theImage,
      receiptData.user = theUser
    );
    console.log('this is the setreceiptdata', receiptData);
    this._userReceipts.next(parsedData);
    this.StoreUserReceiptData(
      receiptData.id
    );
  }

  /// data  is undifined in this function
  private StoreUserReceiptData(receData) {
    const data = JSON.stringify(receData);
    Plugins.Storage.set({key: 'userReceiptData', value: data});
  }

  clearReceiptData() {
    this._userReceipts.next(null);
    Plugins.Storage.remove({key: 'userReceiptData'});
  }

  async loadedReceipts() {
    return this.userReceipts;
  }

  uplaodUserReceipt(image, total_spending, category, userTokens) {
     // format the data before attaching it to the http-request
    const data = new FormData();
    console.log('this is the image', image);
    data.append('image', image);
    data.append('total_spending', total_spending);
    data.append('category', category);

    const myheaders = new HttpHeaders();
    myheaders.append('Content-Type', 'multipart/form-data');
    myheaders.append('Authorization', userTokens),
    myheaders.append('Access-Control-Allow-Origin', 'http://localhost:8100');
    myheaders.append('Access-Control-Allow-Headers', 'Content-Type');

    const headerz = new HttpHeaders({
      'Content-Type': 'multipart/form-data',
      Authorization:   userTokens,

    });

    const headers = new Headers({
      Accept: 'multipart/form-data',
      enctype: 'multipart/form-data',
      Authorization: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MzYsImV4cCI6MTU5MDcxOTg0NH0.rmeppwEBsym0kMnb4SZk4jBEUqkiRyaCeF-YO43O06k',
      'Content-Type': 'multipart/form-data',
      'Access-Control-Allow-Headers': 'Content-Type'
    });

    const headerx = new HttpHeaders({
      'Access-Control-Allow-Origin': 'http://localhost:8100',
      'Content-Type': 'multipart/form-data',
      Authorization:   userTokens,

   });


    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'multipart/form-data',
        // Accept:  'multipart/form-data',  
        Authorization:   userTokens,
       //'Access-Control-Allow-Origin': 'http://localhost:8100',
       // 'Access-Control-Expose-Headers': 'Authorization, Access-Control-Allow-Origin',
      })
    };

    // this.http.post(this.postBaseurl, data, httpOptions).subscribe(res => {
    //    console.log(res);
    //  });

    const xhr = new XMLHttpRequest();
    
    const url = this.postBaseurl;
    xhr.open('POST', url, true);
    // xhr.setRequestHeader('Accept', 'multipart/form-data');
    xhr.setRequestHeader( 'authorization', userTokens );
    // xhr.setRequestHeader('Access-Control-Allow-origin', 'http://localhost:8100');
    xhr.setRequestHeader('Content-Type',  'application/json');
    xhr.setRequestHeader('Origin', 'http://localhost:8100');
    // xhr.setRequestHeader('Access-Control-Request-Method', 'POST');
    // xhr.setRequestHeader('Access-Control-Request-Headers', 'Origin, Content-Type');
    xhr.withCredentials = true;
    return xhr.send(data);

  //   let myHeaders = new HttpHeaders();
  //   myHeaders = myHeaders.set('Content-Type',  'multipart/form-data');
  //   myHeaders = myHeaders.set('Authorization',   userTokens);

  //   return this.http.post(this.postBaseurl, {body: data, headers: myHeaders }).subscribe(res => {
  //     console.log(res);
  //     });
    }


}
// 'Access-Control-Allow-Origin': '*',
// 'Content-Type': 'multipart/form-data',
// Authorization: 'Token ' +  userToken,
// 'Access-Control-Allow-Headers': 'Content-Type',

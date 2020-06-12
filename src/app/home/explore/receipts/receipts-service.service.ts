

import { AuthServiceService } from './../../../authentication/auth-service.service';
import { tap, map, switchMap } from 'rxjs/operators';
import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Receipt } from './receipts.model';
import { Plugins } from '@capacitor/core';
import { ReturnStatement } from '@angular/compiler';




export interface ReceiptData {
 id: string;
 image: string;
 user: string;

}

@Injectable({
  providedIn: 'root'
})
export class ReceiptsServiceService implements OnInit {

  // tslint:disable-next-line: variable-name
  private _userReceipts = new BehaviorSubject<Receipt[]>([]) ;
  userReceipts = [];
  handler;
  xhr;

  constructor(private http: HttpClient,
              private authService: AuthServiceService,
              ) { }


  baseUrl = 'https://fleeks.herokuapp.com/api/receiptview/';
  postBaseurl = 'https://fleeks.herokuapp.com/api/receipts/';
  deleteBaseUrl = 'https://fleeks.herokuapp.com/api/delete_receipt/';

  get Receipts() {
    return this._userReceipts.asObservable();
  }


  ngOnInit() {
  }

  loadUserReceipts() {
    
   return this. authService.userToken.pipe(switchMap(userToken => {
      return this.http.get<any>(this.baseUrl, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Token ' + userToken,
        }
      }).pipe(map(resData => {
        console.log('this is response', resData);
        const receiptsData = [];
        for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              receiptsData.push(new Receipt
                (
                  resData[key].pk,
                  resData[key].user,
                  resData[key].total_spending,
                  resData[key].category,
                  resData[key].tags,
                  resData[key].receipt_image_set,
                  new Date(resData[key].created_at)
              ));
            }
          }
        return receiptsData;
      }),
        tap(receiptData => {
          this._userReceipts.next(receiptData);
        })
      );
   }));
    // .subscribe(results => {
    //   this.userReceipts.push(results);
    //   this. proccessedResults(results);
    // });
  }

  proccessedResults(receiptData) {
    let incomingData = [];
    incomingData = receiptData;
    console.log('this is the incoming data', incomingData);
    const dataReceipt = [];
    for (const key of incomingData) {
      dataReceipt.push(key);
      this.setReceiptData(key);
   }
  }
    


 setReceiptData(receiptData) {

    // tslint:disable-next-line: variable-name
    const userReceipt_Data = new Receipt(
      receiptData.pk,
      receiptData.user,
      receiptData.total_spending,
      receiptData.category,
      receiptData.tags,
      receiptData.receipt_image_set,
      receiptData.created_at
    );
    console.log('this is the setreceiptdata', receiptData);
    this.StoreUserReceiptData(userReceipt_Data);
    
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
    console.log('this is the set', this._userReceipts);
    return this.userReceipts;
  }

  // tslint:disable-next-line: variable-name
  uplaodUserReceipt(image, total_spending, category, userTokens) {

     // format the data before attaching it to the http-request
    const data = new FormData();
    console.log('this is the image', image);
    data.append('image', image);
    data.append('total_spending', total_spending);
    data.append('category', category);

    const xhr = new XMLHttpRequest();
    const url = this.postBaseurl;
    xhr.open('POST', url, true);
    xhr.setRequestHeader( 'Authorization', 'Token ' + userTokens );
    xhr.withCredentials = true;
    return xhr.send(data);

    }


    deleteReceipt(pk) {
     return this.http.delete(`${this.deleteBaseUrl}${pk}/`).subscribe(resData => {
      /// this._userReceipts
     });
    }


}


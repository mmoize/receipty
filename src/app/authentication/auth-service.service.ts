import { ProfileserviceService } from './../home/profile/profileservice.service';
import * as jwt_decode from 'jwt-decode';



import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { User } from './user.model';
import { map, tap, filter } from 'rxjs/operators';

import { Plugins } from '@capacitor/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';


export interface AuthResponseData {
  user_id: string;
  username: string;
  email: string;
  token: string;
  expiresIn: Date;
}


@Injectable({
  providedIn: 'root'
})
export class AuthServiceService implements OnDestroy {

  constructor(private http: HttpClient,
              private profileserivice: ProfileserviceService,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private router: Router ,
              ) { }

  // tslint:disable-next-line: variable-name
  private _user = new BehaviorSubject<User>(null);
  private activeLogoutTimer: any;
  isLogin = true;
  isLoading = false;

  baseUrl = 'https://receity.herokuapp.com/api/users/';

  getTokenExpirationDate(token: string): Date {
    const decoded = jwt_decode(token);
    if (decoded.exp === undefined) { return null; }
    const date  = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  getUserId(token: string) {
    const decoded = jwt_decode(token);
    const userId = decoded.id;
    return userId;
  }

  private setUserData(userData: AuthResponseData) {
    const oneToken = JSON.stringify(userData);
    const parsedToken = JSON.parse(oneToken);
    const theToken = parsedToken.user.token;
    const theUsername = parsedToken.user.username;
    const theEmail = parsedToken.user.email;
    const theUserId = this.getUserId(theToken);
    const tokenExpirationDate =  this.getTokenExpirationDate(theToken);
    const user = new User(
      userData.user_id = theUserId,
      userData.username = theUsername,
      userData.email = theEmail,
      userData.token = theToken,
      tokenExpirationDate,
    );
    this._user.next(user);
    this.autoLogout(user.tokenDuration);
    this.storeAuthData(userData.user_id, userData.username, userData.email, userData.token, tokenExpirationDate);
  }

  // tslint:disable-next-line: variable-name
  private storeAuthData(user_id: string, username: string, email: string, token: string, tokenExpirationDate: Date ) {
    const data = JSON.stringify({user_id, username, email, token, tokenExpirationDate });
    Plugins.Storage.set({key: 'authData', value: data});
  }


  get userIsAuthenticated() {
    return  this._user.asObservable().pipe(map(user => {
        if (user) {
          return  !! user.token;
        } else {
          return false;
        }
      })
    );
  }



  get UserId() {
    return this._user.asObservable().pipe(map(user => {
      if (user) {
        return user.user_id;
      } else {
        return null;
      }
    }));
  }

  get userToken() {
    return this._user.asObservable().pipe(map(user => {
      if (user) {
        return user.token;
      } else {
        return null;
      }
    }));
  }

  get User_username() {
    return this._user.asObservable().pipe(map(userRes => {
      return userRes.username;
    }));
  }

  autoLogin() {
    return from (Plugins.Storage.get({key: 'authData'}))
      .pipe(map(storedData => {
         if (!storedData || !storedData.value) {
           return null;
         }
         const parsedData = JSON .parse(storedData.value) as
         {user_Id: string; username: string;  email: string; token: string; tokenExpirationDate: string };
         const expirationTime = new Date(parsedData.tokenExpirationDate);
         if (expirationTime <= new Date()) {
           return null;
         }
         const user = new User(
          parsedData.user_Id,
          parsedData.username,
          parsedData.email,
          parsedData.token,
          expirationTime
         );
         return user;
      }),
      tap(user => {
        if (user) {
          this._user.next(user);
          this.autoLogout(user.tokenDuration);
        }
      }),
      map(user => {
        return !!user;
      })
    );
  }

  private autoLogout(duration: number) {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }



  signup(email: string,  password: string, username: string, ) {
    return this.http.post<AuthResponseData>(this.baseUrl, {email, password, username})
    .pipe(tap(this.setUserData.bind(this)));
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(`${this.baseUrl}login/`, {email, password})
    .pipe(tap(this.setUserData.bind(this)));
  }


  logout() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }

    this._user.next(null);
    Plugins.Storage.remove({key: 'authData'});

    this.profileserivice.clearProfile();
  }


  ngOnDestroy() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
  }


  async returnUserId() {
    const { value } = await Plugins.Storage.get({ key : 'authData'}) ;
    const dit = JSON.parse(value);
    const dat = dit.user_id;
    return dat;
  }

  async returnUserToken() {
    const { value } = await Plugins.Storage.get({ key : 'authData'}) ;
    const dit = JSON.parse(value);
    const dat = dit.token;
    return dat;
  }





}

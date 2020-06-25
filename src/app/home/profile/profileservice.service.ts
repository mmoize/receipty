import { ProfileSettingsPage } from './profile-settings/profile-settings.page';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Plugins } from '@capacitor/core';

import { tap, map } from 'rxjs/operators';
import { userProfileData } from './userProfileData.model';


export interface ProfileData {
  user_id: string;
  username: string;
  f_name: string;
  l_name: string;
  country: string;
  city: string;
  bio: string;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileserviceService {

  condo = [];
  // tslint:disable-next-line: variable-name
  private _userProfileData = new BehaviorSubject<userProfileData>(null);
  userresultData;
  constructor(
               private http: HttpClient,
               ) { }

  baseUrl = 'https://fleeks.herokuapp.com/api/profiles/';
  profileEditUrl = 'https://fleeks.herokuapp.com/api/user/';

   fetchProfile(id) {
    return this.http.get<ProfileData>(`${this.baseUrl}${id}`);
  }

  setProfile(profileData: ProfileData) {
    const rawData = JSON.stringify(profileData);
    const parseData = JSON.parse(rawData);
    const theUserID = parseData.profile.user_id;
    const theUsername = parseData.profile.username;
    const theFname = parseData.profile.f_name;
    const theLname = parseData.profile.l_name;
    const theCountry = parseData.profile.country;
    const theCity = parseData.profile.city;
    const theBio = parseData.profile.bio;
    const theimage = parseData.profile.image;
    const userProfile = new userProfileData (
       profileData.user_id = theUserID,
       profileData.username = theUsername,
       profileData.f_name = theFname,
       profileData.l_name = theLname,
       profileData.country = theCountry,
       profileData.city = theCity,
       profileData.bio = theBio,
       profileData.image = theimage

    );
    this._userProfileData.next(userProfile);
    this.userresultData = userProfile;
    this.storeUserProfileData(
      profileData.user_id,
      profileData.username,
      profileData.f_name,
      profileData.l_name,
      profileData.country,
      profileData.city,
      profileData.bio,
      profileData.image
      );
  }

  private storeUserProfileData(
    // tslint:disable-next-line: variable-name
    user_id: string,
    username: string,
    // tslint:disable-next-line: variable-name
    f_name: string,
    // tslint:disable-next-line: variable-name
    l_name: string,
    country: string,
    city: string,
    bio: string,
    image: string,

     ) {
       const data = JSON.stringify({user_id, username, f_name, l_name, country, city, bio, image});
       Plugins.Storage.set({key: 'userProfileData', value: data});
  }


  loadUserProfile(id) {
    return this.http.get<ProfileData>(`${this.baseUrl}${id}`).pipe(tap(this.setProfile.bind(this)));

  }



  clearProfile() {
    this._userProfileData.next(null);
    Plugins.Storage.remove({key: 'userProfileData'});
  }


  UserProfileinfo(token, userData) {

    const data = userData;
    const xhr = new XMLHttpRequest();
    const url = this.profileEditUrl;
    xhr.open('PATCH', url, true);
    xhr.setRequestHeader( 'Authorization', 'Token ' + token );
    xhr.withCredentials = true;
    return xhr.send(data);

  }


}

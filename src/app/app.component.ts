import { AuthServiceService } from './authentication/auth-service.service';
import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { Plugins, Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private authservice: AuthServiceService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // if (Capacitor.isPluginAvailable('SplashScreen')) {
      //   setTimeout(() => {
      //     SplashScreen.hide();
      //   }, 1000);
      //  }
    });
  }

  onLogout() {
    this.authservice.logout();
  }
}

import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from './services/auth.service';
import { Storage } from '@ionic/storage';
import { strings } from './config/strings';
import { Router } from '@angular/router';
import { LocalNotifications, ELocalNotificationTriggerUnit } from '@ionic-native/local-notifications/ngx';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  public signout = strings.ST8;
  notification_info : any;
  seconds_diff : any;
  public appPages = [
    {
      title: strings.ST1,
      url: '/first',
      icon: 'calendar'
    },
    {
      title: strings.ST3,
      url: '/diets',
      icon: 'restaurant'
    },
    {
      title: strings.ST5,
      url: '/motivation',
      icon: 'newspaper'
    },
    {
      title: strings.ST105,
      url: '/calculator',
      icon: 'calculator'
    },
    {
      title: strings.ST6,
      url: '/profile',
      icon: 'person'
    },
    {
      title: strings.ST7,
      url: '/contact',
      icon: 'bookmark'
    },
  ];

  constructor(
    private platform: Platform,
    public navCtrl: NavController,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private dataService: DataService,
    public afAuth: AngularFireAuth,
    private storage: Storage,
    private localNotifications: LocalNotifications,
    public authService: AuthService

  ) {
    this.initializeApp();
  }

  initializeApp() {
  
    this.platform.ready().then( async () => {
      this.openNotification();

      this.statusBar.styleLightContent();
      this.splashScreen.hide();
    });
  }
  openNotification(){
    this.dataService.getTipByDate().subscribe( resp => {
      if(resp.length > 0){
        this.getObject('notification_info').then(result => {
          if (result != null) {
            this.notification_info = JSON.parse(result);
            if(this.notification_info.enabled)
              this.scheduleNotification(resp[0]);
          }//else{}
        }).catch(e => {
          console.log('error: ', e);
        });        
      }
    });
  } 
  logout() {
    this.authService.doLogout()
    .then(res => {
      this.navCtrl.pop();
    }, err => {
      console.log(err);
    });
  }

  scheduleNotification(tips){

      if(this.localNotifications.isScheduled(1))
        this.cancelNotification(1);

      var current_date = new Date();
      var notification_date = new Date();
      notification_date.setHours(this.notification_info.hour,this.notification_info.minutes, 0);
      notification_date = new Date(notification_date.getTime());
      this.seconds_diff = (notification_date.getTime() - current_date.getTime()) / 1000;

      this.localNotifications.schedule({
        id: 1,
        title: tips.start,
        text: tips.tip_title,
        
        trigger: { in : this.seconds_diff, unit : ELocalNotificationTriggerUnit.SECOND }
      });  


  }

  cancelNotification(id : number) : void
  {
     this.localNotifications.cancel(id).then((data) =>
     {
        console.log('Success', 'All notifications have been cancelled');
     })
     .catch((error) =>
     {
      console.log('Error', error);
     });
  }

  async getObject(key: string): Promise<any> {
    try {
      const result = await this.storage.get(key);
      if (result != null) {
      return JSON.stringify(result);
      }
      return null;
    } catch (reason) {
      console.log(reason);
      return null;
    }
  }
}

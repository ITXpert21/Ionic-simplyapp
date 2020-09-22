import { Component, OnInit } from '@angular/core';
import { strings } from '../../config/strings';
import { Platform, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Location } from "@angular/common";
import { DataService } from '../../services/data.service';
import { TipsObject } from '../../interfaces/interfaces';
import { LocalNotifications, ELocalNotificationTriggerUnit } from '@ionic-native/local-notifications/ngx';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.page.html',
  styleUrls: ['./myaccount.page.scss'],
})
export class MyaccountPage implements OnInit {
  public strings = strings;
  rowHeight : any;
  rowHeight1 : any;
  rowHeight2 : any;
  cardHeight : any;
  profile_name : any;
  hour : any;
  minutes : any;
  full_name : any;
  email : any;
  userinfo :any;
  notification_info : any;
  notification_toggle = true;
  notificaton_time : any;
  notificaton_timetext : any;
  seconds_diff : any;
  slideOpts = {
    initialSlide: 1,
    speed: 400
  };
  tips: TipsObject[] = [];
  constructor(
    public plt: Platform, 
    private storage: Storage,
    private dataService: DataService,
    private localNotifications: LocalNotifications,
    public alertController: AlertController,
    private router: Router,
    public authService: AuthService,
    private location: Location
  ) { 
    this.plt.ready().then(() =>{
      // Register click event listener for each local notification
        this.localNotifications.on('click').subscribe(notification =>{
          this.router.navigate(['/tips']);

        });
        this.localNotifications.on('trigger').subscribe(notification =>{
        });

     });
  }

  ngOnInit() {

    this.notificaton_timetext = "7:00 am";

    this.getObject('notification_info').then(result => {
      if (result != null) {
        this.notification_info = JSON.parse(result);
        this.notificaton_timetext = this.notification_info.notificaton_timetext;
        this.hour = this.notification_info.hour;
        this.minutes = this.notification_info.minutes;
        this.notification_toggle = this.notification_info.enabled;
      }else{
        this.notificaton_timetext = "7:00 am";
        this.notification_toggle = true;
      }
    }).catch(e => {
      console.log('error: ', e);
    });
    

  }
  async ionViewWillEnter() {
    this.getObject('userinfo').then(result => {
      if (result != null) {
        this.userinfo = JSON.parse(result);
        this.profile_name = this.userinfo.first_name.substring(0,1) +  this.userinfo.last_name.substring(0,1);
        this.full_name = this.userinfo.first_name + ' ' + this.userinfo.last_name;
        this.email = this.userinfo.email;

        this.dataService.getFavoriteTipsList(this.userinfo.id).subscribe( resp => {
          for(let i=0; i<resp.length; i++){
            resp[i].tip_text = resp[i].tip_text.split("&lt;").join("<");
            resp[i].tip_text = resp[i].tip_text.split("&gt;").join(">");
            resp[i].title_date = new Date(resp[i].start.replace(' ', 'T'));
            resp[i].tip_text = resp[i].tip_text.substring(0, 350) + '....';
          }
          this.tips = resp;
        });
      }
      }).catch(e => {
      console.log('error: ', e);
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
      return null;
    }
  } 
  openNotification(){
    this.dataService.getTipByDate().subscribe( resp => {
      if(resp.length > 0){
        if(this.notification_toggle){
          this.scheduleNotification(resp[0]);
        }
      }
    });
  } 
  goClosePage() {
    this.location.back();
  }

  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      cssClass: 'alertCustomCss',
      header: 'Notification',
      inputs: [

        {
          name: 'notification_time',
          type: 'time',
          //cssClass: 'notification_time',
          placeholder: 'Placeholder 2',
          //value : this.notificaton_timetext
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: data =>{
            if(data.notification_time)
              this.setNotificationTime(data);
          }
        }
      ]
    });
    await alert.present();
  }
  setNotificationTime(data){
    this.hour = parseInt(data.notification_time.split(":")[0]);
    this.minutes = parseInt(data.notification_time.split(":")[1]);

    var current_date = new Date();
    var notification_date = new Date();
    notification_date.setHours(this.hour,this.minutes, 0);
    notification_date = new Date(notification_date.getTime());

    this.seconds_diff = (notification_date.getTime() - current_date.getTime()) / 1000;
    if(this.hour > 12){
      if(this.minutes < 10)
        this.notificaton_timetext = (this.hour-12).toString() + ":0" + this.minutes.toString() + " PM";
      else
        this.notificaton_timetext = (this.hour-12).toString() + ":" + this.minutes.toString() + " PM";
    }
    // if(this.hour < 10){
    //   if(this.minutes < 10)
    //     this.notificaton_timetext = "0" + this.hour.toString() + ":0" + this.minutes.toString() + " AM";
    //   else
    //     this.notificaton_timetext = "0" + this.hour.toString() + ":" + this.minutes.toString() + " AM";
    // }
    if(this.hour == 12 ){
      if(this.minutes < 10)
        this.notificaton_timetext = this.hour.toString() + ":0" + this.minutes.toString() + " PM";
      else
        this.notificaton_timetext = this.hour.toString() + ":" + this.minutes.toString() + " PM";
    }
    if(this.hour > 9 && this.hour < 12 ){
      if(this.minutes < 10)
        this.notificaton_timetext = this.hour.toString() + ":0" + this.minutes.toString() + " AM";
      else
        this.notificaton_timetext = this.hour.toString() + ":" + this.minutes.toString() + " AM";
    }  
    if(this.hour < 10 ){
      if(this.minutes < 10)
        this.notificaton_timetext = "0" + this.hour.toString() + ":0" + this.minutes.toString() + " AM";
      else
        this.notificaton_timetext = "0" + this.hour.toString() + ":" + this.minutes.toString() + " AM";
    }        
    this.notification_info = {
      notification_time : this.notificaton_time,
      hour : this.hour,
      minutes : this.minutes,
      notificaton_timetext : this.notificaton_timetext,
      enabled : this.notification_toggle
    };
    this.storage.set('notification_info', this.notification_info);
    this.openNotification();

  }

  updateToggle(event){
    this.notification_toggle = event.detail.checked;


    if(this.notification_toggle)
      this.openNotification();
    else
      this.unschedulelNotification();

    
      this.notification_info = {
        notification_time : this.notificaton_time,
        hour : this.hour,
        minutes : this.minutes,
        notificaton_timetext : this.notificaton_timetext,
        enabled : this.notification_toggle
      };
    this.storage.set('notification_info', this.notification_info);
    
    
  }

  scheduleNotification(tips){
    this.plt.ready().then( async () => {
      // this.localNotifications.getIds().then((result) => {

      //   if(result[0] == 1){
      //     this.unschedulelNotification();
      //   }
      if(this.localNotifications.isScheduled(1))
        this.cancelNotification(1);
      this.localNotifications.schedule({
        id: 1,
        title: tips.start,
        text: tips.tip_title,
        trigger: { in : this.seconds_diff, unit : ELocalNotificationTriggerUnit.SECOND }
      });  

      //});
  });

  }

  async unschedulelNotification(){
    this.plt.ready().then( async () => {
      const result =  await this.localNotifications.clearAll();
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
  gotoPersonalInfo(){
    this.router.navigate(['/editaccount']);
  }
  logout(){
    this.authService.doLogout()
    .then(res => {
      this.storage.clear().then(() => {
        this.router.navigate(['/login']);
      });
    }, err => {
      console.log(err);
    });

  }
}

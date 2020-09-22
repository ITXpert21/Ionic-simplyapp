import { Component, OnInit } from '@angular/core';
import { strings } from '../../config/strings';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { InAppBrowser, InAppBrowserOptions  } from '@ionic-native/in-app-browser/ngx';
import { AuthService } from '../../services/auth.service';

import { Router } from '@angular/router';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  public strings = strings;
  rowHeight : any;
  rowHeight2 : any;
  profile_name : any;
  userinfo :any;
  options : InAppBrowserOptions = {
    location : 'yes',//Or 'no' 
    hidden : 'no', //Or  'yes'
    clearcache : 'yes',
    clearsessioncache : 'yes',
    zoom : 'yes',//Android only ,shows browser zoom controls 
    hardwareback : 'yes',
    mediaPlaybackRequiresUserAction : 'no',
    shouldPauseOnSuspend : 'no', //Android only 
    closebuttoncaption : 'Close', //iOS only
    disallowoverscroll : 'no', //iOS only 
    toolbar : 'yes', //iOS only 
    enableViewportScale : 'no', //iOS only 
    allowInlineMediaPlayback : 'no',//iOS only 
    presentationstyle : 'pagesheet',//iOS only 
    fullscreen : 'yes',//Windows only    
};
  constructor(
    public plt: Platform, 
    private router: Router,
    private storage: Storage,
    public authService: AuthService,
    private iab: InAppBrowser
  ) { }

  ngOnInit() {
    this.rowHeight = this.plt.height() / 4+ 'px';
    this.rowHeight2 = this.plt.height() * 3 / 4 + 'px';
  }

  async ionViewWillEnter() {
    this.getObject('userinfo').then(result => {
      if (result != null) {
        this.userinfo = JSON.parse(result);
        this.profile_name = this.userinfo.first_name.substring(0,1) +  this.userinfo.last_name.substring(0,1);
        
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
      console.log(reason);
      return null;
    }
  }
  openPartnerAndFaq(url : string){
    let target = "_system";
    this.iab.create(url,target,this.options);
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
  gotoTips(){
    this.router.navigate(['/tips']);
  }  
  openWithSystemBrowser(url : string){
    let target = "_system";
    this.iab.create(url,target,this.options);
  }
  openWithInAppBrowser(url : string){
    let target = "_blank";
    this.iab.create(url,target,this.options);
  }
  openWithCordovaBrowser(url : string){
    let target = "_self";
    this.iab.create(url,target,this.options);
  }  

}

import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { strings } from '../../config/strings';
import { InAppBrowser, InAppBrowserOptions  } from '@ionic-native/in-app-browser/ngx';
import { Platform } from '@ionic/angular';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media/ngx';
import { config } from '../../config/config';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  rowHeight : any;
  rowHeight1 : any;
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
    public menuCtrl: MenuController,
    public plt: Platform,
    private streamingMedia: StreamingMedia,
    private router: Router,
    private storage: Storage,
    private iab: InAppBrowser) {}

  public strings = strings;

  ionViewWillEnter() {
    this.getObject('userinfo').then(result => {
      if (result != null) {
        this.userinfo = JSON.parse(result);
      
      }
      }).catch(e => {
      console.log('error: ', e);
    });
   }

  ngOnInit() {
    this.rowHeight = this.plt.height() * 2 / 3 -40  + 'px';
    this.rowHeight1 = this.plt.height() * 1 / 3 + 40 + 'px';
    
  }
  getStarted(){
    this.router.navigate(['/tips']);
  }
  playVideo(){
    let options: StreamingVideoOptions = {
      successCallback: () => { console.log('Video played') },
      errorCallback: (e) => { console.log('Error streaming') },
      orientation: 'portrait',
      shouldAutoClose: true,
      controls: false
    };
    
    this.streamingMedia.playVideo(config.Url + '/videos/yoga.mp4', options);
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

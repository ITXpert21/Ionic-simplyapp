import { Component, OnInit, ViewChild } from '@angular/core';
import { strings } from '../../config/strings';
import { Platform, IonSlides } from '@ionic/angular';
import { DataService } from '../../services/data.service';
import { TipsObject } from '../../interfaces/interfaces';
import { Storage } from '@ionic/storage';
import { Location } from "@angular/common";
import { Router } from '@angular/router';

@Component({
  selector: 'app-tips',
  templateUrl: './tips.page.html',
  styleUrls: ['./tips.page.scss'],
})
export class TipsPage implements OnInit {
  public strings = strings;
  rowHeight : any;
  userinfo :any;
  tips: TipsObject[] = [];
  favoritetips: TipsObject[] = [];
  isFavorite = false;
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    slidesPerView: 1,
    freeMode: false

  };
   @ViewChild('tipSlider') slider: IonSlides;
  constructor(
    public plt: Platform,
    private storage: Storage,
    private dataService: DataService,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit() {
    this.rowHeight = this.plt.height()  + 'px';
  }

  async ionViewWillEnter() {
    this.getObject('userinfo').then(result => {
      if (result != null) {
        this.userinfo = JSON.parse(result);
        this.getTipsList(this.userinfo.id);
      }
      }).catch(e => {
      console.log('error: ', e);
    });
    
  }

  getTipsList(userid : any) {
    var today = new Date();
    today.setHours(0,0,0,0);
    this.dataService.getTipsList(userid)
    .subscribe( resp => {
      for(let i=0; i<resp.length; i++){
        resp[i].tip_text = resp[i].tip_text.split("&lt;").join("<");
        resp[i].tip_text = resp[i].tip_text.split("&gt;").join(">");
        resp[i].title_date = new Date(resp[i].start.replace(' ', 'T'));
      }

      for(let i=0; i<resp.length; i++){
        var tip_date = new Date(resp[i].start.replace(' ', 'T'));
        tip_date.setHours(0,0,0,0);
        if(today.getTime() == tip_date.getTime()){
          this.slider.slideTo(i);
          break;
        }
       
      }     
      this.tips = resp;
    });
  }
  // showBannerAd() {
  //   let bannerConfig: AdMobFreeBannerConfig = {
  //       isTesting: true, // Remove in production
  //       autoShow: true,
  //       id: "ca-app-pub-3940256099942544/1033173712"
  //   };
  //   this.admobFree.banner.config(bannerConfig);

  //   this.admobFree.banner.prepare().then(() => {
  //       // success
  //   }).catch(e => alert(e));
  // }

  // showInterstitialAds(){
  //   let interstitialConfig: AdMobFreeInterstitialConfig = {
  //       isTesting: true, // Remove in production
  //       autoShow: true,
  //       id: "ca-app-pub-3940256099942544/1033173712"
  //   };
  //   this.admobFree.interstitial.config(interstitialConfig);
  //   this.admobFree.interstitial.prepare().then(() => {
  //   }).catch(e => alert(e));
  // }

  setFavorite(tip : any){
    var action = "";
    if(tip.favorite == 1)
      action = "remove";
    else
      action = "add";
    this.dataService.setFavorite(tip.id, this.userinfo.id, action, tip.fav_id)
    .subscribe( resp => {
      console.log(resp[0]);
      for(let i=0; i<this.tips.length; i++){
        if(tip.id == this.tips[i].id){
          if(resp[0].action == "remove"){
            this.tips[i].favorite = null;
            this.tips[i].fav_id = null;
          }          
          if(resp[0].action == "add"){
            this.tips[i].favorite = true;
            this.tips[i].fav_id = resp[0].fav_id;
          }
        }
      }
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
  goClosePage() {
    this.location.back();
  }

  gotoProfile(){
    this.router.navigate(['/profile']);
  }

  slideChanged(){
    // if(this.userinfo.paid == 0)
    //   this.showInterstitialAds();
  }
}

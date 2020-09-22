import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { LoginPage } from '../login/login.page';
import { strings } from '../../config/strings';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit {
  rowHeight : any;
  constructor(
    public menuCtrl: MenuController,
    private authService: AuthService,
    public navCtrl: NavController,
    private router: Router,
    public plt: Platform,
    private storage: Storage,
    public modalCtrl: ModalController,
    public loadingController: LoadingController

    ) { }

    // tslint:disable-next-line: variable-name
    private _strings = strings;
    public get strings() {
      return this._strings;
    }

    async ionViewWillEnter() {
      setTimeout(() =>{
        this.getObject('userinfo').then(result => {
          if (result != null) 
            this.router.navigate(['/tips']);
          else
            this.router.navigate(['/login']);
        }).catch(e => {
          console.log('error: ', e);
        });
      }, 3500);
    }

   ngOnInit() {
    this.rowHeight = this.plt.height() / 2 + 'px';

  }

   async presentAlert(value) {
    const loading = await this.loadingController.create({
      spinner: null,
      duration: 2000,
      message: value,
      mode: 'ios'
    });
    await loading.present();
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

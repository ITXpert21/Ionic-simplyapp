import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NavController, MenuController, ModalController, LoadingController } from '@ionic/angular';
import { strings } from '../../config/strings';
import { Storage } from '@ionic/storage';
import { DataService } from '../../services/data.service';
import { ToastController } from '@ionic/angular';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {

  validationsform: FormGroup;
  rowHeight : any;
  isLoading = false;
  constructor(
    private authService: AuthService,
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private router: Router,
    public menuCtrl: MenuController,
    public modalCtrl: ModalController,
    private storage: Storage,
    private DataService: DataService,
    private toastController: ToastController,
    public plt: Platform,
    public loadingController: LoadingController
  ) { }

  // tslint:disable-next-line: variable-name
  private _strings = strings;
  public get strings() {
    return this._strings;
  }

  ngOnInit() {
    this.rowHeight = this.plt.height() / 3 + 'px';
    this.validationsform = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required
      ])),
    });
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

  tryLogin(value) {
    this.isLoading = true;
    this.authService.doLogin(value)
    .then(res => {
      this.DataService.checkUserExist(value).subscribe( resp => {
        console.log("padi===", resp[0].paid);
        var paid = resp[0].paid;
        if(paid == 1){
          this.storage.set('userinfo', resp[0]);
          this.router.navigate(['/home']);
        }else{
          var token = resp[0].token;
          let  navParam = { state: { token: token, email : value.email } };
          this.router.navigate(['/verify'], navParam);
        } 

        this.isLoading = false;
        //this.router.navigate(['/home']);

      });
    }, err => {
      this.isLoading = false;
      if (err.code === 'auth/wrong-password') {
        this.presentAlert(strings.ST30);
      } else if (err.code === 'auth/user-not-found') {
        this.presentAlert(strings.ST31);
      } else {
        this.presentAlert(strings.ST32);
      }
    });
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Account was removed.',
      duration: 3500,
      position: 'top'
    });
    toast.present();
  }
}

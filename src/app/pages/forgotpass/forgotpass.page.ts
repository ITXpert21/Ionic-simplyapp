import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NavController, LoadingController } from '@ionic/angular';
import { strings } from '../../config/strings';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-forgotpass',
  templateUrl: './forgotpass.page.html',
  styleUrls: ['./forgotpass.page.scss'],
})
export class ForgotpassPage implements OnInit {

  public strings = strings;
  validationsform: FormGroup;
  rowHeight : any;
  constructor(
    private authService: AuthService,
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private router: Router,
    public plt: Platform,
    public loadingController: LoadingController
  ) { }


  ngOnInit() {
    this.rowHeight = this.plt.height() / 3 + 'px';
    this.validationsform = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]))
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

  tryRestPass(value) {
    this.authService.doRestPass(value)
    .then(res => {
      this.presentAlert(strings.ST34);
      this.router.navigate(['/login']);
    }, err => {
      if (err.code === 'auth/user-not-found') {
        this.presentAlert(strings.ST31);
      } else {
        this.presentAlert(strings.ST32);
      }
    });
  }
}

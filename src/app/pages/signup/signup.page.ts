import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { strings } from '../../config/strings';
import * as firebase from 'firebase/app';
import { DataService } from '../../services/data.service';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  validationsform: FormGroup;
  isLoading = false;
  rowHeight : any;
  rowBodyHeight : any;
  constructor(
    private authService: AuthService,
    
    private formBuilder: FormBuilder,
    private router: Router,
    private DataService: DataService,
    public plt: Platform,
    private storage: Storage,
    public loadingController: LoadingController
  ) { }

  // tslint:disable-next-line: variable-name
  private _strings = strings;
  public get strings() {
    return this._strings;
  }

  ngOnInit() {
    this.rowHeight = (this.plt.height()) / 5 + 'px';
    this.rowBodyHeight = (this.plt.height()) * 4 / 5 + 'px';

    this.validationsform = this.formBuilder.group({
      first_name: new FormControl('', Validators.compose([
        Validators.required
      ])),
      last_name: new FormControl('', Validators.compose([
        Validators.required
      ])),
      phonenumber: new FormControl('', Validators.compose([
        Validators.required
      ])),      
      birthday: new FormControl('', Validators.compose([
        Validators.required
      ])),
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
  validPhonenumber(phonenumber)
  {
    alert(phonenumber);
    //var regExp = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;
    var regExp = /^\d{10}$/;
    return regExp.test(phonenumber);
  }

  tryRegister(value) {

    this.isLoading = true;

    this.authService.doRegister(value)
    .then(res => {
      firebase.auth().currentUser.updateProfile({
        displayName : value.name,
      });
      var token = res.user.uid;
      this.DataService.registerNewUser(value, token).subscribe( resp => {
        this.isLoading = false;
        //this.storage.set('userinfo', resp[0]);
        let  navParam = { state: { token: token, email : value.email } };
        this.router.navigate(['/verify'], navParam);
      });


    }, err => {
      this.isLoading = false;
      if (err.code === 'auth/email-already-in-use') {
        this.presentAlert(strings.ST36);
      } else {
        this.presentAlert(strings.ST32);
      }
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
}

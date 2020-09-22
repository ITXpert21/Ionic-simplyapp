import { Component, OnInit } from '@angular/core';
import { strings } from '../../config/strings';
import { Platform, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { DataService } from '../../services/data.service';
import { OptionsObject } from '../../interfaces/interfaces';
import { AuthService } from '../../services/auth.service';
import * as firebase from 'firebase/app';
import { Location } from "@angular/common";
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-editaccount',
  templateUrl: './editaccount.page.html',
  styleUrls: ['./editaccount.page.scss'],
})
export class EditaccountPage implements OnInit {
  public strings = strings;
  rowHeight : any;
  rowHeight1 : any;
  rowHeight2 : any;
  full_name : any;
  first_name : any;
  last_name :any;
  newpassword : any;
  confirmpassword : any;
  email : any;
  userinfo :any;
  birthday : any;
  profile_name : any;
  isLoading = false;
  options: OptionsObject[] = [];
  constructor(
    public plt: Platform, 
    private authService: AuthService,
    private dataService: DataService,
    private location: Location,
    public loadingController: LoadingController,
    private storage: Storage
  ) { }

  ngOnInit() {
    this.rowHeight = (this.plt.height()-70) / 5+ 'px';
    this.rowHeight1 = (this.plt.height()-70) * 3 / 5 - 100 + 'px';
    this.rowHeight2 = ((this.plt.height()) / 5 - 50 )+ 'px';
    
    this.getObject('userinfo').then(result => {
      if (result != null) {
        this.userinfo = JSON.parse(result);
        this.profile_name = this.userinfo.first_name.substring(0,1) +  this.userinfo.last_name.substring(0,1);
        this.full_name = this.userinfo.first_name + ' ' + this.userinfo.last_name;
        this.first_name = this.userinfo.first_name;
        this.last_name = this.userinfo.last_name;

        this.email = this.userinfo.email;
        this.birthday = this.userinfo.birthday;

        this.dataService.getOptions(this.userinfo.id)
        .subscribe( resp => {
          this.options = resp;
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
  selectOption(option){
    console.log(option.value);
    this.dataService.getSelectedOptions(option.value, this.userinfo.id, option.id, option.uid)
    .subscribe( resp => {
      this.options = resp;
    });
  }
  async updateAccount(){
    if(this.confirmpassword == undefined || this.newpassword == undefined || this.email == undefined || this.first_name == undefined || this.last_name == undefined || this.birthday == undefined){
      this.presentAlert(strings.ST61);
      return;
    }
    if(this.confirmpassword != this.newpassword){
      this.presentAlert(strings.ST62);
      return;
    }
    this.isLoading = true;
    var user = firebase.auth().currentUser;
    await user.updateEmail(this.email);
    await user.updatePassword(this.confirmpassword);

    var value = {
      id : this.userinfo.id,
      email : this.email,
      password : this.confirmpassword,
      first_name : this.first_name,
      last_name : this.last_name,
      birthday : this.birthday

    }
    this.dataService.updateProfileInfo(value).subscribe( resp => {
      this.isLoading = false;
      this.storage.set('userinfo', resp[0]);
    });

  }
  goClosePage() {
    this.location.back();
  }
  async presentAlert(value) {
    const loading = await this.loadingController.create({
      spinner: null,
      duration: 2000,
      message: value
      //mode: 'ios'
    });
    await loading.present();
  }
}

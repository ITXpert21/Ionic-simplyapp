import { Component, OnInit } from '@angular/core';
import { Stripe } from '@ionic-native/stripe/ngx';
import { HttpClient } from "@angular/common/http";
import { strings } from '../../config/strings';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Platform } from '@ionic/angular';
import { Location } from "@angular/common";
import {  LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-stripe',
  templateUrl: 'stripe.page.html',
  styleUrls: ['stripe.page.scss'],
})
export class StripePage {
  paymentAmount: string = '3.33';
  currency: string = 'USD';
  currencyIcon: string = '$';
  stripe_key = 'pk_test_uw8MdtuBNPSjqxZwQm5eb0qF00VQOseXGT';
  cardDetails: any = {};
  public strings = strings;
  validationsform: FormGroup;
  rowHeight : any;
  creditCardNumber: string;
  isLoading = false;
  constructor(
    private router: Router,
    private stripe: Stripe, 
    private formBuilder: FormBuilder,
    private location: Location,
    public plt: Platform,
    private storage: Storage,
    private dataService: DataService,
    public loadingController: LoadingController,
    private http: HttpClient) {
  }
  ngOnInit() {
    
    this.rowHeight = this.plt.height() / 2 + 'px';

    this.validationsform = this.formBuilder.group({
      card_number: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(19)
      ])),
      expiration_date: new FormControl('', Validators.compose([
        Validators.required
      ])),
      cvv: new FormControl('', Validators.compose([
        Validators.minLength(3),
        Validators.required
      ])),
      name: new FormControl('', Validators.compose([
        Validators.required
      ]))        
    });
  }
  isValidDate(dateString)
  {
      // First check for the pattern
      if(!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString))
          return false;
  
      // Parse the date parts to integers
      var parts = dateString.split("/");
      var day = parseInt(parts[1], 10);
      var month = parseInt(parts[0], 10);
      var year = parseInt(parts[2], 10);
  
      // Check the ranges of month and year
      if(year < 1000 || year > 3000 || month == 0 || month > 12)
          return false;
  
      var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
  
      // Adjust for leap years
      if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
          monthLength[1] = 29;
  
      // Check the range of the day
      return day > 0 && day <= monthLength[month - 1];
  }
  cc_format(value: string) {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length > 0) {
      this.creditCardNumber = parts.join(' ');
    } else {
      this.creditCardNumber = value;
    }
  }

  payWithStripe(value) {
    if(!this.isValidDate(value.expiration_date)){
      this.presentAlert(strings.ST24);
      return;
    }  
    

    this.stripe.setPublishableKey(this.stripe_key);
    var number = value.card_number.split(" ").join("");
    var expMonth = value.expiration_date.split('/')[0];
    var expYear = value.expiration_date.split('/')[2];
    var cvc = value.cvv;

    this.cardDetails = {
      number: number,
      expMonth: expMonth,
      expYear: expYear,
      cvc: cvc
    }
    this.isLoading = true;
    this.stripe.createCardToken(this.cardDetails)
      .then(token => {
        console.log(token);
        this.makePayment(token.id);
      })
      .catch(error => {
        console.error(error)
        this.presentAlert(error.message);
      });
  }

  makePayment(token) {
    this.http.post('https://us-central1-simplyapp-500cf.cloudfunctions.net/payWithStripe', {
          token: token
      })
      .subscribe(data => {
        this.isLoading = false;
        this.getObject('userinfo').then(result => {
          if (result != null) {
            this.dataService.updateUserInfo(JSON.parse(result).id).subscribe( resp => {
              this.storage.set('userinfo', resp[0]);
              this.router.navigate(['/thankyou']);
            });
          }
        }).catch(e => {
          console.log('error: ', e);
        });

        //this.router.navigate(['/thankyou']);
      });
  }
  goClosePage() {
    this.location.back();
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

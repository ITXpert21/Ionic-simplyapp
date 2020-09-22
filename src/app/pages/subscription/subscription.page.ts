import { Component, OnInit } from '@angular/core';
import { strings } from '../../config/strings';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { Location } from "@angular/common";

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.page.html',
  styleUrls: ['./subscription.page.scss'],
})
export class SubscriptionPage implements OnInit {
  public strings = strings;
  rowHeight : any;
  constructor(
    private router: Router,
    public plt: Platform,
    private location: Location
  ) { }

  ngOnInit() {
    this.rowHeight = this.plt.height() / 3 +20 + 'px';
  }
  gotoCheckout(){
    this.router.navigate(['/stripe']);
  }
  goClosePage() {
    this.location.back();
  }
  gotoTips(){
    this.router.navigate(['/tips']);
  }
}

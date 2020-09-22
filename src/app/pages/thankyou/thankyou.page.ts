import { Component, OnInit } from '@angular/core';
import { strings } from '../../config/strings';
import { Platform } from '@ionic/angular';
import { Location } from "@angular/common";
import { Router } from '@angular/router';

@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.page.html',
  styleUrls: ['./thankyou.page.scss'],
})
export class ThankyouPage implements OnInit {
  public strings = strings;
  rowHeight : any;
  constructor(
    public plt: Platform,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit() {
    this.rowHeight = (this.plt.height() - 70)/2 + 'px';
  }
  goClosePage() {
    this.location.back();
  }
  goTips() {
    this.router.navigate(['/tips']);
  }
}

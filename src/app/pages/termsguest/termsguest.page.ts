import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { strings } from '../../config/strings';
import { Router } from '@angular/router';

@Component({
  selector: 'app-termsguest',
  templateUrl: './termsguest.page.html',
  styleUrls: ['./termsguest.page.scss'],
})
export class TermsguestPage implements OnInit {

  privacypolicy: any;
  termsofservice: any;
  isLoading = true;

  constructor(
    public modalCtrl: ModalController,
    private router: Router
  ) { }

    // tslint:disable-next-line: variable-name
    private _strings = strings;
    public get strings() {
      return this._strings;
    }

    ngOnInit() {
    }

    async goClosePage() {
      this.router.navigate(['/login']);
    }

}

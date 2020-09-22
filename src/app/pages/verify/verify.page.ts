import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { strings } from '../../config/strings';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.page.html',
  styleUrls: ['./verify.page.scss'],
})
export class VerifyPage implements OnInit {
  rowHeight : any;
  navparam : any;
  private _strings = strings;
  public get strings() {
    return this._strings;
    

  }
  constructor(
    public plt: Platform,
    private route: ActivatedRoute,
    private DataService: DataService,
    private router: Router,
  ) { 
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.navparam= this.router.getCurrentNavigation().extras.state;
        
      }
    });
  }

  ngOnInit() {
    this.rowHeight = this.plt.height() + 'px';
    console.log("11111111111", this.navparam.token);
    this.DataService.sendEmail(this.navparam.token, this.navparam.email).subscribe( resp => {

    });
  }

}

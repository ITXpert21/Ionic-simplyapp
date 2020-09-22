import { Component, OnInit, Input } from '@angular/core';
import { Location } from "@angular/common";
@Component({
  selector: 'app-backbutton',
  templateUrl: './backbutton.component.html',
  styleUrls: ['./backbutton.component.scss'],
})
export class BackbuttonComponent implements OnInit {

  @Input() color;
  buttonIcon : any;
  constructor(    
    private location: Location) { 
}
  
  ngOnInit() {}

  backButton() {
    this.location.back();
  }

}

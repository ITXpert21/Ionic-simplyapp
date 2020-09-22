import { Component, ViewEncapsulation, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-quotehtml',
  templateUrl: './quotehtml.component.html',
  styleUrls: ['./quotehtml.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class QuotehtmlComponent implements OnInit {
  @Input() htmlcontent: any;

  constructor() { }

  ngOnInit() {}

}

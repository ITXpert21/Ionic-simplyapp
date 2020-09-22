import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { QuotehtmlComponent } from './quotehtml.component';

describe('QuotehtmlComponent', () => {
  let component: QuotehtmlComponent;
  let fixture: ComponentFixture<QuotehtmlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotehtmlComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(QuotehtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

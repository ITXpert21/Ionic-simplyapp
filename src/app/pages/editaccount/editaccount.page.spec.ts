import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditaccountPage } from './editaccount.page';

describe('EditaccountPage', () => {
  let component: EditaccountPage;
  let fixture: ComponentFixture<EditaccountPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditaccountPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditaccountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

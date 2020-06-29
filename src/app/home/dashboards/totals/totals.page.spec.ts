import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TotalsPage } from './totals.page';

describe('TotalsPage', () => {
  let component: TotalsPage;
  let fixture: ComponentFixture<TotalsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TotalsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

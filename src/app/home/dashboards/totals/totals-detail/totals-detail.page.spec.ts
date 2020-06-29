import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TotalsDetailPage } from './totals-detail.page';

describe('TotalsDetailPage', () => {
  let component: TotalsDetailPage;
  let fixture: ComponentFixture<TotalsDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalsDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TotalsDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

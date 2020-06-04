import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReceiptsPage } from './receipts.page';

describe('ReceiptsPage', () => {
  let component: ReceiptsPage;
  let fixture: ComponentFixture<ReceiptsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiptsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReceiptsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

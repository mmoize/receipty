import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DashboardsPage } from './dashboards.page';

describe('DashboardsPage', () => {
  let component: DashboardsPage;
  let fixture: ComponentFixture<DashboardsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

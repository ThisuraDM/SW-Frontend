import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncentiveInfoPieChartComponent } from './incentive-info-pie-chart.component';

describe('IncentiveInfoPieChartComponent', () => {
  let component: IncentiveInfoPieChartComponent;
  let fixture: ComponentFixture<IncentiveInfoPieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncentiveInfoPieChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncentiveInfoPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

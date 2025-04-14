import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepaidIncentiveReportComponent } from './prepaid-incentive-report.component';

describe('PrepaidIncentiveReportComponent', () => {
  let component: PrepaidIncentiveReportComponent;
  let fixture: ComponentFixture<PrepaidIncentiveReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrepaidIncentiveReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepaidIncentiveReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncentiveReportCardComponent } from './incentive-report-card.component';

describe('IncentiveReportCardComponent', () => {
  let component: IncentiveReportCardComponent;
  let fixture: ComponentFixture<IncentiveReportCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncentiveReportCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncentiveReportCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

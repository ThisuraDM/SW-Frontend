import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RcspDetailSummaryComponent } from './rcsp-detail-summary.component';

describe('RcspDetailSummaryComponent', () => {
  let component: RcspDetailSummaryComponent;
  let fixture: ComponentFixture<RcspDetailSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RcspDetailSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RcspDetailSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

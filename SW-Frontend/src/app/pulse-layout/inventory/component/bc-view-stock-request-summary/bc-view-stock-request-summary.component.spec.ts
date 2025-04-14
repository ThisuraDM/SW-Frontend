import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcViewStockRequestSummaryComponent } from './bc-view-stock-request-summary.component';

describe('BcViewStockRequestSummaryComponent', () => {
  let component: BcViewStockRequestSummaryComponent;
  let fixture: ComponentFixture<BcViewStockRequestSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcViewStockRequestSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcViewStockRequestSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

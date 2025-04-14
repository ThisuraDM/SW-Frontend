import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerSearchAndViewTransactionDetailsComponent } from './dealer-search-and-view-transaction-details.component';

describe('DealerSearchAndViewTransactionDetailsComponent', () => {
  let component: DealerSearchAndViewTransactionDetailsComponent;
  let fixture: ComponentFixture<DealerSearchAndViewTransactionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealerSearchAndViewTransactionDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerSearchAndViewTransactionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerSearchToTrackStockTransferComponent } from './dealer-search-to-track-stock-transfer.component';

describe('DealerSearchToTrackStockTransferComponent', () => {
  let component: DealerSearchToTrackStockTransferComponent;
  let fixture: ComponentFixture<DealerSearchToTrackStockTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealerSearchToTrackStockTransferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerSearchToTrackStockTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

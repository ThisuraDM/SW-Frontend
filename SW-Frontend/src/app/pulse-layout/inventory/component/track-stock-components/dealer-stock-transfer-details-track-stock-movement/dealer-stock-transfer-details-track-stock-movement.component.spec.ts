import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerStockTransferDetailsTrackStockMovementComponent } from './dealer-stock-transfer-details-track-stock-movement.component';

describe('DealerStockTransferDetailsTrackStockMovementComponent', () => {
  let component: DealerStockTransferDetailsTrackStockMovementComponent;
  let fixture: ComponentFixture<DealerStockTransferDetailsTrackStockMovementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealerStockTransferDetailsTrackStockMovementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerStockTransferDetailsTrackStockMovementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

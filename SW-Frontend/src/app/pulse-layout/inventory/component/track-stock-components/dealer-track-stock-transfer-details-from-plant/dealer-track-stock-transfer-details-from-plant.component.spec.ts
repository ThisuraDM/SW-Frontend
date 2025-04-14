import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerTrackStockTransferDetailsFromPlantComponent } from './dealer-track-stock-transfer-details-from-plant.component';

describe('DealerTrackStockTransferDetailsFromPlantComponent', () => {
  let component: DealerTrackStockTransferDetailsFromPlantComponent;
  let fixture: ComponentFixture<DealerTrackStockTransferDetailsFromPlantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealerTrackStockTransferDetailsFromPlantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerTrackStockTransferDetailsFromPlantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

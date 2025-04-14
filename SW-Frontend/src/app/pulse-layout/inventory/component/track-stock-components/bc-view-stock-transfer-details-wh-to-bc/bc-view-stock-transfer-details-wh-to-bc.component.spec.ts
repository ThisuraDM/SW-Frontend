import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcViewStockTransferDetailsWhToBcComponent } from './bc-view-stock-transfer-details-wh-to-bc.component';

describe('BcViewStockTransferDetailsWhToBcComponent', () => {
  let component: BcViewStockTransferDetailsWhToBcComponent;
  let fixture: ComponentFixture<BcViewStockTransferDetailsWhToBcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcViewStockTransferDetailsWhToBcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcViewStockTransferDetailsWhToBcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

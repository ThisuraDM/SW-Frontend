import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcTrackStockTransferManagement } from './bc-track-stock-transfer-management.component';

describe('BcTrackStockTransferManagement', () => {
  let component: BcTrackStockTransferManagement;
  let fixture: ComponentFixture<BcTrackStockTransferManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcTrackStockTransferManagement ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcTrackStockTransferManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

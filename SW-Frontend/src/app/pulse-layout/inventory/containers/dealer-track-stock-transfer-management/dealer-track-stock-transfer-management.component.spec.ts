import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerTrackStockTransferManagementComponent } from './dealer-track-stock-transfer-management.component';

describe('DealerTrackStockTransferManagementComponent', () => {
  let component: DealerTrackStockTransferManagementComponent;
  let fixture: ComponentFixture<DealerTrackStockTransferManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealerTrackStockTransferManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerTrackStockTransferManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

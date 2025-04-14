import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerStockRequestAddUpdateAddressPopupComponent } from './dealer-stock-request-add-update-address-popup.component';

describe('DealerStockRequestAddUpdateAddressPopupComponent', () => {
  let component: DealerStockRequestAddUpdateAddressPopupComponent;
  let fixture: ComponentFixture<DealerStockRequestAddUpdateAddressPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealerStockRequestAddUpdateAddressPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerStockRequestAddUpdateAddressPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

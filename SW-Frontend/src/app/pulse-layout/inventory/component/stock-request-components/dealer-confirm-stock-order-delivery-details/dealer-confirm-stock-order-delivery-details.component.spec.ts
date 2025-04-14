import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerConfirmStockOrderDeliveryDetailsComponent } from './dealer-confirm-stock-order-delivery-details.component';

describe('DealerConfirmStockOrderDeliveryDetailsComponent', () => {
  let component: DealerConfirmStockOrderDeliveryDetailsComponent;
  let fixture: ComponentFixture<DealerConfirmStockOrderDeliveryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealerConfirmStockOrderDeliveryDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerConfirmStockOrderDeliveryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

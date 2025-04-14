import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockTransferRequestAcceptanceComponent } from './stock-transfer-request-acceptance.component';

describe('StockTransferRequestAcceptanceComponent', () => {
  let component: StockTransferRequestAcceptanceComponent;
  let fixture: ComponentFixture<StockTransferRequestAcceptanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockTransferRequestAcceptanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockTransferRequestAcceptanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

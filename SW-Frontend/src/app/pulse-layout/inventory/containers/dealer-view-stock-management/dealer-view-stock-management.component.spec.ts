import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerViewStockManagementComponent } from './dealer-view-stock-management.component';

describe('DealerViewStockManagementComponent', () => {
  let component: DealerViewStockManagementComponent;
  let fixture: ComponentFixture<DealerViewStockManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealerViewStockManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerViewStockManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

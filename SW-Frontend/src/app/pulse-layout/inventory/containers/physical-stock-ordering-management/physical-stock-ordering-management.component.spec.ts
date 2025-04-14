import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalStockOrderingManagementComponent } from './physical-stock-ordering-management.component';

describe('PhysicalStockOrderingManagementComponent', () => {
  let component: PhysicalStockOrderingManagementComponent;
  let fixture: ComponentFixture<PhysicalStockOrderingManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhysicalStockOrderingManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalStockOrderingManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcViewStockManagementComponent } from './bc-view-stock-management.component';

describe('BcViewStockManagementComponent', () => {
  let component: BcViewStockManagementComponent;
  let fixture: ComponentFixture<BcViewStockManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcViewStockManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcViewStockManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

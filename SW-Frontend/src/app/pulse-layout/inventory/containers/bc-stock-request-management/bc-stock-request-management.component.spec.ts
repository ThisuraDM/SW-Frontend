import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcStockRequestManagementComponent } from './bc-stock-request-management.component';

describe('BcStockRequestManagementComponent', () => {
  let component: BcStockRequestManagementComponent;
  let fixture: ComponentFixture<BcStockRequestManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcStockRequestManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcStockRequestManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

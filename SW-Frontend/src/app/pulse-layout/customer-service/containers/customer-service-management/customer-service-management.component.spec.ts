import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerServiceManagementComponent } from './customer-service-management.component';

describe('CustomerServiceManagementComponent', () => {
  let component: CustomerServiceManagementComponent;
  let fixture: ComponentFixture<CustomerServiceManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerServiceManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerServiceManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

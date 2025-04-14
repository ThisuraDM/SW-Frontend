import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerDeviceThresholdManagementComponent } from './dealer-device-threshold-management.component';

describe('DealerDeviceThresholdManagementComponent', () => {
  let component: DealerDeviceThresholdManagementComponent;
  let fixture: ComponentFixture<DealerDeviceThresholdManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealerDeviceThresholdManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerDeviceThresholdManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

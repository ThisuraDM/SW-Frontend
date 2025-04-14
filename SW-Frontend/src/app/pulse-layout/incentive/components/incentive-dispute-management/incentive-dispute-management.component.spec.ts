import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncentiveDisputeManagementComponent } from './incentive-dispute-management.component';

describe('IncentiveDisputeManagementComponent', () => {
  let component: IncentiveDisputeManagementComponent;
  let fixture: ComponentFixture<IncentiveDisputeManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncentiveDisputeManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncentiveDisputeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

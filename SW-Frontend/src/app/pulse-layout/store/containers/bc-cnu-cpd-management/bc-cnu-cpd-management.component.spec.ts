import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcCnuCpdManagementComponent } from './bc-cnu-cpd-management.component';

describe('BcCnuCpdManagementComponent', () => {
  let component: BcCnuCpdManagementComponent;
  let fixture: ComponentFixture<BcCnuCpdManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcCnuCpdManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcCnuCpdManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

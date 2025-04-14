import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RcspDeliveryDetailsComponent } from './rcsp-delivery-details.component';

describe('RcspDeliveryDetailsComponent', () => {
  let component: RcspDeliveryDetailsComponent;
  let fixture: ComponentFixture<RcspDeliveryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RcspDeliveryDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RcspDeliveryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

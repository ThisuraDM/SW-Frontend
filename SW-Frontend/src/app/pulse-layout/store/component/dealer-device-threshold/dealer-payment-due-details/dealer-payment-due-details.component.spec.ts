import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerPaymentDueDetailsComponent } from './dealer-payment-due-details.component';

describe('DealerPaymentDueDetailsComponent', () => {
  let component: DealerPaymentDueDetailsComponent;
  let fixture: ComponentFixture<DealerPaymentDueDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealerPaymentDueDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerPaymentDueDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

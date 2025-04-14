import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptReprintManagementComponent } from './receipt-reprint-management.component';

describe('ReceiptReprintManagementComponent', () => {
  let component: ReceiptReprintManagementComponent;
  let fixture: ComponentFixture<ReceiptReprintManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiptReprintManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptReprintManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

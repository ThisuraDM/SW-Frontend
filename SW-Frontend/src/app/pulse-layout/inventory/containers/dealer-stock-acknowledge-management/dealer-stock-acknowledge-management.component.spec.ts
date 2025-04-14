import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerStockAcknowledgeManagementComponent } from './dealer-stock-acknowledge-management.component';

describe('DealerStockAcknowledgeManagementComponent', () => {
  let component: DealerStockAcknowledgeManagementComponent;
  let fixture: ComponentFixture<DealerStockAcknowledgeManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealerStockAcknowledgeManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerStockAcknowledgeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

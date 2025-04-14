import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalStockOrderingComponent } from './physical-stock-ordering.component';

describe('PhysicalStockOrderingComponent', () => {
  let component: PhysicalStockOrderingComponent;
  let fixture: ComponentFixture<PhysicalStockOrderingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhysicalStockOrderingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalStockOrderingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

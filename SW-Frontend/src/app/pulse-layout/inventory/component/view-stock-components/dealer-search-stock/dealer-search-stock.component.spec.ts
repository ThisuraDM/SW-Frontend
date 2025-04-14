import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerSearchStockComponent } from './dealer-search-stock.component';

describe('DealerSearchStockComponent', () => {
  let component: DealerSearchStockComponent;
  let fixture: ComponentFixture<DealerSearchStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealerSearchStockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerSearchStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

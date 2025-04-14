import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcSearchStockComponent } from './bc-search-stock.component';

describe('BcSearchStockComponent', () => {
  let component: BcSearchStockComponent;
  let fixture: ComponentFixture<BcSearchStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcSearchStockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcSearchStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

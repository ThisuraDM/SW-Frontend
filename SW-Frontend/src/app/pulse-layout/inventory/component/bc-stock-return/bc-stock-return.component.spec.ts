import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcStockReturnComponent } from './bc-stock-return.component';

describe('BcStockReturnComponent', () => {
  let component: BcStockReturnComponent;
  let fixture: ComponentFixture<BcStockReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcStockReturnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcStockReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

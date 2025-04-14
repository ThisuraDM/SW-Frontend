import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcViewStockLevelDetailsComponent } from './bc-view-stock-level-details.component';

describe('BcViewStockLevelDetailsComponent', () => {
  let component: BcViewStockLevelDetailsComponent;
  let fixture: ComponentFixture<BcViewStockLevelDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcViewStockLevelDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcViewStockLevelDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

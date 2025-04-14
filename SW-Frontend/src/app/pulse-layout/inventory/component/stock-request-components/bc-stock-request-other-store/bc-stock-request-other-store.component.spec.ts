import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcStockRequestOtherStoreComponent } from './bc-stock-request-other-store.component';

describe('BcStockRequestOtherStoreComponent', () => {
  let component: BcStockRequestOtherStoreComponent;
  let fixture: ComponentFixture<BcStockRequestOtherStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcStockRequestOtherStoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcStockRequestOtherStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

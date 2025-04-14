import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RcspStockResultComponent } from './rcsp-stock-result.component';

describe('RcspStockResultComponent', () => {
  let component: RcspStockResultComponent;
  let fixture: ComponentFixture<RcspStockResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RcspStockResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RcspStockResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

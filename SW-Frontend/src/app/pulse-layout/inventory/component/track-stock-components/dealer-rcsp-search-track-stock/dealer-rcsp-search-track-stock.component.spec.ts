import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerRcspSearchTrackStockComponent } from './dealer-rcsp-search-track-stock.component';

describe('DealerRcspSearchTrackStockComponent', () => {
  let component: DealerRcspSearchTrackStockComponent;
  let fixture: ComponentFixture<DealerRcspSearchTrackStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealerRcspSearchTrackStockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerRcspSearchTrackStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

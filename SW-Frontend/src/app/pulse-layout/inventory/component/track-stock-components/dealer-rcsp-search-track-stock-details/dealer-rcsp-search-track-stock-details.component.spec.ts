import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerRcspSearchTrackStockDetailsComponent } from './dealer-rcsp-search-track-stock-details.component';

describe('DealerRcspSearchTrackStockDetailsComponent', () => {
  let component: DealerRcspSearchTrackStockDetailsComponent;
  let fixture: ComponentFixture<DealerRcspSearchTrackStockDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealerRcspSearchTrackStockDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerRcspSearchTrackStockDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

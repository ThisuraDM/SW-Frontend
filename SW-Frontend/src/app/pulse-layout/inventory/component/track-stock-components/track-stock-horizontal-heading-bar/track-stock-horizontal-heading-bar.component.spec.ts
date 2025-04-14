import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackStockHorizontalHeadingBarComponent } from './track-stock-horizontal-heading-bar.component';

describe('TrackStockHorizontalHeadingBarComponent', () => {
  let component: TrackStockHorizontalHeadingBarComponent;
  let fixture: ComponentFixture<TrackStockHorizontalHeadingBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackStockHorizontalHeadingBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackStockHorizontalHeadingBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

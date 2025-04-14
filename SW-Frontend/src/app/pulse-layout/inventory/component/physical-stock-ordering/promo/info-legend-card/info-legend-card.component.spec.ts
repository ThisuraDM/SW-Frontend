import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoLegendCardComponent } from './info-legend-card.component';

describe('InfoLegendCardComponent', () => {
  let component: InfoLegendCardComponent;
  let fixture: ComponentFixture<InfoLegendCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoLegendCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoLegendCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

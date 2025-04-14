import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncentiveInfoCardComponent } from './incentive-info-card.component';

describe('IncentiveInfoCardComponent', () => {
  let component: IncentiveInfoCardComponent;
  let fixture: ComponentFixture<IncentiveInfoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncentiveInfoCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncentiveInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

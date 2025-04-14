import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncentiveAnnouncementCardComponent } from './incentive-announcement-card.component';

describe('IncentiveAnnouncementCardComponent', () => {
  let component: IncentiveAnnouncementCardComponent;
  let fixture: ComponentFixture<IncentiveAnnouncementCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncentiveAnnouncementCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncentiveAnnouncementCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPayoutComponent } from './view-payout.component';

describe('ViewPayoutComponent', () => {
  let component: ViewPayoutComponent;
  let fixture: ComponentFixture<ViewPayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

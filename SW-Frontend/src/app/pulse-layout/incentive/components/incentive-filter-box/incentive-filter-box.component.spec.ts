import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncentiveFilterBoxComponent } from './incentive-filter-box.component';

describe('IncentiveFilterBoxComponent', () => {
  let component: IncentiveFilterBoxComponent;
  let fixture: ComponentFixture<IncentiveFilterBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncentiveFilterBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncentiveFilterBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

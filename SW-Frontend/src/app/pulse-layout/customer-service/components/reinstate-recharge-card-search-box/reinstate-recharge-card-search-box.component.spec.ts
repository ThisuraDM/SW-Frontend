import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReinstateRechargeCardSearchBoxComponent } from './reinstate-recharge-card-search-box.component';

describe('ReinstateRechargeCardSearchBoxComponent', () => {
  let component: ReinstateRechargeCardSearchBoxComponent;
  let fixture: ComponentFixture<ReinstateRechargeCardSearchBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReinstateRechargeCardSearchBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReinstateRechargeCardSearchBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

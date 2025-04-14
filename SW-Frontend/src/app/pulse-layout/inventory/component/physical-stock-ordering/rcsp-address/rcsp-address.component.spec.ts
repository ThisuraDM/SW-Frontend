import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RcspAddressComponent } from './rcsp-address.component';

describe('RcspAddressComponent', () => {
  let component: RcspAddressComponent;
  let fixture: ComponentFixture<RcspAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RcspAddressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RcspAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

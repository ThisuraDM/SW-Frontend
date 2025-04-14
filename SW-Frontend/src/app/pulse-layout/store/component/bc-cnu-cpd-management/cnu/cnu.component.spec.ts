import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnuComponent } from './cnu.component';

describe('CnuComponent', () => {
  let component: CnuComponent;
  let fixture: ComponentFixture<CnuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

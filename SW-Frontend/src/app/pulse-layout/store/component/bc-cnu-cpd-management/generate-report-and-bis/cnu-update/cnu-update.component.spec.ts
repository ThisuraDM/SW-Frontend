import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnuUpdateComponent } from './cnu-update.component';

describe('CnuUpdateComponent', () => {
  let component: CnuUpdateComponent;
  let fixture: ComponentFixture<CnuUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnuUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnuUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

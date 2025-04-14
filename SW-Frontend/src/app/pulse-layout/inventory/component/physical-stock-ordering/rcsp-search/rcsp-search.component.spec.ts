import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RcspSearchComponent } from './rcsp-search.component';

describe('RcspSearchComponent', () => {
  let component: RcspSearchComponent;
  let fixture: ComponentFixture<RcspSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RcspSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RcspSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

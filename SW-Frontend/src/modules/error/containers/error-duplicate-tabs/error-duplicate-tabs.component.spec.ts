import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorDuplicateTabsComponent } from './error-duplicate-tabs.component';

describe('ErrorDuplicateTabsComponent', () => {
  let component: ErrorDuplicateTabsComponent;
  let fixture: ComponentFixture<ErrorDuplicateTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErrorDuplicateTabsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorDuplicateTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

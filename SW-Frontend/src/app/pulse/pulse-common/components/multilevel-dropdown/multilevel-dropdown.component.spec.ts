import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultilevelDropdownComponent } from './multilevel-dropdown.component';

describe('MultilevelDropdownComponent', () => {
  let component: MultilevelDropdownComponent;
  let fixture: ComponentFixture<MultilevelDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultilevelDropdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultilevelDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

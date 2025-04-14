import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainCategoryCardComponent } from './main-category-card.component';

describe('MainCategoryCardComponent', () => {
  let component: MainCategoryCardComponent;
  let fixture: ComponentFixture<MainCategoryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainCategoryCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainCategoryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

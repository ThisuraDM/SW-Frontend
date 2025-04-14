import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnmatchedItemComponent } from './unmatched-item.component';

describe('UnmatchedItemComponent', () => {
  let component: UnmatchedItemComponent;
  let fixture: ComponentFixture<UnmatchedItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnmatchedItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnmatchedItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

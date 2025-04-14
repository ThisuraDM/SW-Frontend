import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateReportAndBISComponent } from './generate-report-and-bis.component';

describe('GenerateReportAndBISComponent', () => {
  let component: GenerateReportAndBISComponent;
  let fixture: ComponentFixture<GenerateReportAndBISComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateReportAndBISComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateReportAndBISComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThresholdInformationComponent } from './threshold-information.component';

describe('ThresholdInformationComponent', () => {
    let component: ThresholdInformationComponent;
    let fixture: ComponentFixture<ThresholdInformationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ThresholdInformationComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ThresholdInformationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

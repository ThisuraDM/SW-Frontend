import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThresholdRequestComponent } from './threshold-request.component';

describe('ThresholdRequestComponent', () => {
    let component: ThresholdRequestComponent;
    let fixture: ComponentFixture<ThresholdRequestComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ThresholdRequestComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ThresholdRequestComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

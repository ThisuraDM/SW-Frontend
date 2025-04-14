import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusVerificationAlertsComponent } from './status-verification-alerts.component';

describe('StatusVerificationAlertsComponent', () => {
    let component: StatusVerificationAlertsComponent;
    let fixture: ComponentFixture<StatusVerificationAlertsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [StatusVerificationAlertsComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(StatusVerificationAlertsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

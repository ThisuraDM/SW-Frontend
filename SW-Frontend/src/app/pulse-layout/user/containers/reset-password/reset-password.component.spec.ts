import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordComponent } from './reset-password.component';

/**
 * SW reset password component
 * Author: Thisura Munasinghe
 * Created Date: 2021 October 17
 */
describe('ResetPasswordComponent', () => {
    let component: ResetPasswordComponent;
    let fixture: ComponentFixture<ResetPasswordComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ResetPasswordComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ResetPasswordComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

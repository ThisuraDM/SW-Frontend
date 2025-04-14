import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangePasswordComponent } from './change-password.component';

/**
 * SW change password component
 * Author: Thisura Munasinghe
 * Created Date: 2021 October 17
 */
describe('ChangePasswordComponent', () => {
    let component: ChangePasswordComponent;
    let fixture: ComponentFixture<ChangePasswordComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChangePasswordComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ChangePasswordComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

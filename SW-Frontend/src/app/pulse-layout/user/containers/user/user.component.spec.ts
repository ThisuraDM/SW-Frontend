import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserComponent } from './user.component';

/**
 * SW user container
 * Author: Thisura Munasinghe
 * Created Date: 2021 August 3
 */
describe('UserComponent', () => {
    let component: UserComponent;
    let fixture: ComponentFixture<UserComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UserComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(UserComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

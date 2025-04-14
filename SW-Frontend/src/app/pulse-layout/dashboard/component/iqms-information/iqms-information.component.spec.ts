import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IqmsInformationComponent } from './iqms-information.component';

/**
 * SW iqms information component
 * Author: Thilina Kelum
 * Created Date: 2021 July 10
 */
describe('IqmsInformationComponent', () => {
    let component: IqmsInformationComponent;
    let fixture: ComponentFixture<IqmsInformationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IqmsInformationComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(IqmsInformationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

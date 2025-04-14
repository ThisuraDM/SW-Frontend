import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyRequiredTrendComponent } from './daily-required-trend.component';

/**
 * SW daily required trend component
 * Author: Thisura Munasinghe
 * Created Date: 2021 August 16
 */
describe('DailyRequiredTrendComponent', () => {
    let component: DailyRequiredTrendComponent;
    let fixture: ComponentFixture<DailyRequiredTrendComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DailyRequiredTrendComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DailyRequiredTrendComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

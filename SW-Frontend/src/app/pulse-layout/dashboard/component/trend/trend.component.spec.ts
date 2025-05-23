import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendComponent } from './trend.component';

/**
 * SW trend component
 * Author: Thisura Munasinghe
 * Created Date: 2021 August 10
 */
describe('TrendComponent', () => {
    let component: TrendComponent;
    let fixture: ComponentFixture<TrendComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TrendComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TrendComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

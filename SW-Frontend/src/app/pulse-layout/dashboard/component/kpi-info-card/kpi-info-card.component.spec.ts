import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiInfoCardComponent } from './kpi-info-card.component';

/**
 * SW kpi information card component
 * Author: Milan Perera
 * Created Date: 2021 July 15
 */
describe('KpiInfoCardComponent', () => {
    let component: KpiInfoCardComponent;
    let fixture: ComponentFixture<KpiInfoCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [KpiInfoCardComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(KpiInfoCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

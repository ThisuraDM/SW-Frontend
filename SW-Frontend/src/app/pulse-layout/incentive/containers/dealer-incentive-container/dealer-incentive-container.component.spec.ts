import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerIncentiveContainerComponent } from './dealer-incentive-container.component';

describe('DealerIncentiveContainerComponent', () => {
    let component: DealerIncentiveContainerComponent;
    let fixture: ComponentFixture<DealerIncentiveContainerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DealerIncentiveContainerComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DealerIncentiveContainerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

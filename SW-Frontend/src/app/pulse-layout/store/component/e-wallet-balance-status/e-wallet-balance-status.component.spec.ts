import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EWalletBalanceStatusComponent } from './e-wallet-balance-status.component';

/**
 * SW e wallet balance status component
 * Author: Thisura Munasinghe
 * Created Date: 2021 Septmber 25
 */
describe('EWalletBalanceStatusComponent', () => {
    let component: EWalletBalanceStatusComponent;
    let fixture: ComponentFixture<EWalletBalanceStatusComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EWalletBalanceStatusComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EWalletBalanceStatusComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

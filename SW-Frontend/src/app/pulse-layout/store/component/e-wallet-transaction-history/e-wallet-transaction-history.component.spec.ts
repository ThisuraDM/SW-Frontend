import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EWalletTransactionHistoryComponent } from './e-wallet-transaction-history.component';

/**
 * SW e wallet transaction history component
 * Author: Thilina Kelum
 * Created Date: 2021 October 10
 */
describe('EWalletTransactionHistoryComponent', () => {
    let component: EWalletTransactionHistoryComponent;
    let fixture: ComponentFixture<EWalletTransactionHistoryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EWalletTransactionHistoryComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EWalletTransactionHistoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

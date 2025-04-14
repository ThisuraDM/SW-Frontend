import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EWalletTopupBoxComponent } from './e-wallet-topup-box.component';

/**
 * SW e wallet top up box component
 * Author: Milan Perera
 * Created Date: 2021 October 10
 */
describe('EWalletTopupBoxComponent', () => {
    let component: EWalletTopupBoxComponent;
    let fixture: ComponentFixture<EWalletTopupBoxComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EWalletTopupBoxComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EWalletTopupBoxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

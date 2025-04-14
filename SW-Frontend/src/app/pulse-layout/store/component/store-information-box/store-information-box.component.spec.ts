import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreInformationBoxComponent } from './store-information-box.component';

describe('StoreInformationBoxComponent', () => {
    let component: StoreInformationBoxComponent;
    let fixture: ComponentFixture<StoreInformationBoxComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [StoreInformationBoxComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(StoreInformationBoxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

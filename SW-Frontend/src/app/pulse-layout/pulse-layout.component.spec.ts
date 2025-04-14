import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SWLayoutComponent } from './SW-layout.component';

describe('SWAppComponent', () => {
    let component: SWLayoutComponent;
    let fixture: ComponentFixture<SWLayoutComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SWLayoutComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SWLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

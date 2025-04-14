import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThresholdCollectionListComponent } from './threshold-collection-list.component';

describe('ThresholdCollectionListComponent', () => {
    let component: ThresholdCollectionListComponent;
    let fixture: ComponentFixture<ThresholdCollectionListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ThresholdCollectionListComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ThresholdCollectionListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

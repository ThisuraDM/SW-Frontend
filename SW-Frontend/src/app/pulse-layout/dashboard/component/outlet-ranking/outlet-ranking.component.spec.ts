import { Component, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { OutletRankingComponent } from './outlet-ranking.component';

/**
 * SW outlet ranking component
 * Author: Thisura Munasinghe
 * Created Date: 2021 August 15
 */
@Component({
    template: `
        <sbpro-dashboard-tables
            [someInput]="someInput"
            (someFunction)="someFunction($event)"
        ></sbpro-dashboard-tables>
    `,
})
class TestHostComponent {
    // someInput = 1;
    // someFunction(event: Event) {}
}

describe('DashboardTablesComponent', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let hostComponent: TestHostComponent;
    let hostComponentDE: DebugElement;
    let hostComponentNE: Element;

    let component: OutletRankingComponent;
    let componentDE: DebugElement;
    let componentNE: Element;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestHostComponent, OutletRankingComponent],
            imports: [NoopAnimationsModule],
            providers: [],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        hostComponent = fixture.componentInstance;
        hostComponentDE = fixture.debugElement;
        hostComponentNE = hostComponentDE.nativeElement;

        componentDE = hostComponentDE.children[0];
        component = componentDE.componentInstance;
        componentNE = componentDE.nativeElement;

        fixture.detectChanges();
    });

    it('should display the component', () => {
        expect(hostComponentNE.querySelector('sbpro-dashboard-tables')).toEqual(jasmine.anything());
    });
});

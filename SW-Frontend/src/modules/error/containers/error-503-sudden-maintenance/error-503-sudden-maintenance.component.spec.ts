import { Component, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Error503SuddenMaintenanceComponent } from '@modules/error/containers/error-503-sudden-maintenance/error-503-sudden-maintenance.component';


@Component({
    template: `
        <sbpro-error-503
            [someInput]="someInput"
            (someFunction)="someFunction($event)"
        ></sbpro-error-503>
    `,
})
class TestHostComponent {
    // someInput = 1;
    // someFunction(event: Event) {}
}

describe('Error503Component', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let hostComponent: TestHostComponent;
    let hostComponentDE: DebugElement;
    let hostComponentNE: Element;

    let component: Error503SuddenMaintenanceComponent;
    let componentDE: DebugElement;
    let componentNE: Element;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestHostComponent, Error503SuddenMaintenanceComponent],
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
        expect(hostComponentNE.querySelector('sbpro-error-503')).toEqual(jasmine.anything());
    });
});

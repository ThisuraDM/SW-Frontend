import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    TemplateRef,
    ViewChild,
} from '@angular/core';
import { CardBase } from '@common/classes';

@Component({
    selector: 'sbpro-card-navigation',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './card-navigation.component.html',
    styleUrls: ['card-navigation.component.scss'],
})
export class CardNavigationComponent extends CardBase implements OnInit, AfterViewInit {
    @ViewChild('fadeableSection') fadeableSection!: ElementRef<HTMLDivElement>;

    @Input() navNames!: string[];
    @Input() templates!: TemplateRef<unknown>[];
    @Input() navType: 'tabbed' | 'pill' | 'vertical' = 'tabbed';
    @Input() isCardHeaderVisible = false;
    @Input() cardHeader = '';

    @Output() onNavItemClick = new EventEmitter<string>();
    @Input()
    selectedIndex = 0;
    selectedIndexForFade = 0;
    fadeableElement!: HTMLDivElement;

    constructor(public changeDetectorRef: ChangeDetectorRef) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.selectedIndexForFade = this.selectedIndex;
    }

    ngAfterViewInit() {
        this.fadeableElement = this.fadeableSection.nativeElement;
        this.fadeableElement.addEventListener('transitionend', (event) => {
            this.selectedIndexForFade = this.selectedIndex;
            this.fadeableElement.style.opacity = '100';
            this.changeDetectorRef.detectChanges();
        });
    }

    setSelectedIndex(index: number) {
        this.fadeableElement.style.opacity = '0';
        this.selectedIndex = index;
        this.onNavItemClick.emit(this.navNames[index]);
    }

}

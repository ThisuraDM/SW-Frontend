import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'SW-toggle-button',
  templateUrl: './toggle-button.component.html',
  styleUrls: ['./toggle-button.component.scss']
})
export class ToggleButtonComponent implements OnInit, OnChanges {

    @Output() outputValue = new EventEmitter<string>();
    @Input() value1 = '';
    @Input() value2 = '';
    @Input() changeValue = 'promo';
    switcher = 'switcher__input--promo';

    constructor() {
    }

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.changeValue === 'promo') {
            this.switcher = 'switcher__input--promo';
        } else {
            this.switcher = 'switcher__input--normal';
        }
    }

    toggle(value: string) {
        this.outputValue.emit(value);
    }

    switcherInput(input: string) {
        return this.switcher;
    }
}

import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'SW-bc-cnu-cpd-management',
  templateUrl: './bc-cnu-cpd-management.component.html',
  styleUrls: ['./bc-cnu-cpd-management.component.scss']
})
export class BcCnuCpdManagementComponent implements OnInit, AfterViewInit {

    @ViewChild('cnuButton') cnuButton?: ElementRef;

    public title = 'Store Management';

    public displayedScreen: 'cnu' | 'generate-report' | 'cpd' = 'cnu';

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
      setTimeout(() => this.autoClickCNUButton(), 200);
      // this.autoClickCNUButton();
  }

    private autoClickCNUButton(): void {
      const button: HTMLElement = document.getElementById('cnuButton') as HTMLElement;
      button.click();
  }

}

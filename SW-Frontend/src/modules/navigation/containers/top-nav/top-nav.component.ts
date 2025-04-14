import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { NavigationService } from '@modules/navigation/services';
import { LocalStorageService } from 'services/local-storage.service';

@Component({
    selector: 'sb-top-nav',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './top-nav.component.html',
    styleUrls: ['top-nav.component.scss'],
})
export class TopNavComponent implements OnInit {
    public isBC = false;
    @Input() rtl = false;
        constructor(private navigationService: NavigationService,private localStorageService: LocalStorageService,) {}
    ngOnInit() {
        this.isBC = this.localStorageService.isBCUser()
    }
    toggleSideNav() {
        this.navigationService.toggleSideNav();
    }
    
}

import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '@modules/auth/services';
import { SideNavItems, SideNavSection } from '@modules/navigation/models';
import { NavigationService } from '@modules/navigation/services';
import { Subscription } from 'rxjs';
import { StorageSettings } from '../../../../constants/StorageSettings';
import { LocalStorageService } from '../../../../services/local-storage.service';

@Component({
    selector: 'sb-side-nav',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './side-nav.component.html',
    styleUrls: ['side-nav.component.scss'],
})
export class SideNavComponent implements OnInit, OnDestroy {
    @Input() sidenavStyle!: string;
    @Input() sideNavItems!: SideNavItems;
    @Input() sideNavSections!: SideNavSection[];

    subscription: Subscription = new Subscription();
    routeDataSubscription!: Subscription;
    userName!: string | null;
    position!: string | null;

    constructor(public navigationService: NavigationService,
                public userService: UserService,
                private localStorageService: LocalStorageService) {}

    ngOnInit() {
        this.userName = this.localStorageService.get(StorageSettings.NAME);
        this.position = this.localStorageService.get(StorageSettings.POSITION);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}

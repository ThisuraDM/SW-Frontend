import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { LocalStorageService } from '../../../services/local-storage.service';
import { AuthService } from '../services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
    providedIn: 'root',
})
export class RedirectGuard implements CanActivate {
    constructor(
        private router: Router,
        private authService: AuthService,
        private modalService: NgbModal,
        private localStorageService: LocalStorageService,
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        let token: any;
        const fragment = route.fragment;
        if (fragment !== undefined && fragment !== null) {
            const urlParams = new URLSearchParams(fragment);
            token = urlParams.get('id_token');
            this.localStorageService.setToken(token);
        } else {
            token = this.localStorageService.getToken();
        }
        if (token !== null) {
            this.checkPermissions();
            return true;
        } else {
            this.router.navigate(['/error/403']);
            return false;
        }
    }

    checkPermissions() {
        this.authService.login().then((value) => {
            if (this.localStorageService.getPermissions().includes('KPI_DASHBOARD_BC')) {
                this.authService.loadRegionAndOutlet().then(value1 => {
                    this.router.navigate(['/dashboard']);
                    this.modalService.dismissAll();
                });
            } else if (this.localStorageService.getPermissions().includes('KPI_DASHBOARD_DEALER')) {
                this.router.navigate(['/dashboard/dealer-kpi-dashboard']);
                this.modalService.dismissAll();
            } else {            
                this.router.navigate(['/error/403']);
                this.modalService.dismissAll();
            }
        });
        this.authService.initialLogin = false;
    }
}

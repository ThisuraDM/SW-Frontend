import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { LocalStorageService } from '../../../services/local-storage.service';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root',
})
export class PermissionGuard implements CanActivate {
    constructor(private router: Router,
         private localStorageService: LocalStorageService,
         private authService: AuthService,) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if(this.authService.initialLogin){
            const result = this.localStorageService.getPermissions().includes(route.data.role);
            if (!result) {
                this.router.navigate(['/error/403']);
            }
            return result;
        }else{
            const perm = this.localStorageService.getPermissions();
            if(perm){
                const result = this.localStorageService.getPermissions().includes(route.data.role);
                if (!result) {
                    this.router.navigate(['/error/403']);
                }
                return result;
            }else{
                this.authService.logout();
                return perm
            }
        } 
    }
}

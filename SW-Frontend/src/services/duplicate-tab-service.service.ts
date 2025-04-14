import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DuplicateTabService {
  private readonly STORAGE_KEY = 'myAppTab';
  private readonly ACTIVE_TAB_VALUE = 'active';

  constructor() { 
  }

  checkDuplicateTabs(){
    localStorage.openpages = Date.now();
    window.addEventListener('storage', function (e) {
        if(e.key == "openpages") {
            // Listen if anybody else is opening the same page!
            localStorage.page_available = Date.now();
        }
        if(e.key == "page_available") {
            window.location.replace('./403-duplicate-tab');
        }
    }, false);
  };
 
}

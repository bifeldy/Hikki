import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { onSideNavChange, animateText } from '../../animations/anim-side-menu';

import { LeftMenuService } from '../../services/left-menu.service';
import { AuthService } from '../../services/auth.service';
import { GlobalService } from '../../services/global.service';
import { BusyService } from '../../services/busy.service';
import { LocalStorageService } from '../../services/local-storage.service';

import User from '../../models/User';
import { Menu } from '../../models/Menu';

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.css'],
  animations: [onSideNavChange, animateText]
})
export class LeftMenuComponent implements OnInit, OnDestroy {

  currentUser: User = null;

  subsUser = null;
  subsLogout = null;

  constructor(
    private router: Router,
    private lms: LeftMenuService,
    private as: AuthService,
    public gs: GlobalService,
    private bs: BusyService,
    private ls: LocalStorageService
  ) {
    if (this.gs.isBrowser) {
      //
    }
  }

  get mainMenus(): Menu[] {
    return this.lms.mainMenus;
  }

  get contentMenus(): Menu[] {
    return this.lms.contentMenus;
  }

  get miscMenus(): Menu[] {
    return this.lms.miscMenus;
  }

  ngOnDestroy(): void {
    this.subsUser?.unsubscribe();
    this.subsLogout?.unsubscribe();
  }

  ngOnInit(): void {
    if (this.gs.isBrowser) {
      this.subsUser = this.as.currentUser.subscribe({ next: user => this.currentUser = user });
    }
  }

  get sideNavExpanded(): any {
    return this.lms.sideNavExpanded;
  }

  get linkText(): any {
    return this.lms.linkText;
  }

  onMouseHoverIn(): void {
    this.lms.onMouseHoverIn();
  }

  onMouseHoverOut(): void {
    this.lms.onMouseHoverOut();
  }

  logout(): void {
    this.bs.busy();
    this.subsLogout = this.as.logout().subscribe({
      next: (res: any) => {
        this.gs.log('[LOGOUT_SUCCESS]', res);
        this.as.removeUser();
        this.bs.idle();
        this.router.navigateByUrl('/');
      },
      error: err => {
        this.gs.log('[LOGOUT_ERROR]', err);
        this.as.removeUser();
        this.bs.idle();
        this.router.navigateByUrl('/');
      }
    });
  }

  toggleDebugLog($event): void {
    this.gs.forceEnableDebugLog = $event.checked;
    this.ls.setItem(this.gs.localStorageLoggingKeyName, JSON.stringify($event.checked));
  }

}

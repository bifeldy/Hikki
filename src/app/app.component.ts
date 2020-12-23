import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, RouteConfigLoadStart, RouteConfigLoadEnd, NavigationStart } from '@angular/router';

import { onMainContentChange } from './_shared/animations/anim-side-menu';

import { environment } from '../environments/environment';

import { LeftMenuService } from './_shared/services/left-menu.service';
import { PageInfoService } from './_shared/services/page-info.service';
import { AuthService } from './_shared/services/auth.service';
import { FabService } from './_shared/services/fab.service';
import { BusyService } from './_shared/services/busy.service';
import { GlobalService } from './_shared/services/global.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [ onMainContentChange ]
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('leftSideNav') leftSideNav;
  @ViewChild('leftSideNavContent') leftSideNavContent;

  selectedBackgroundImage = '';

  subsRouter = null;
  subsRouterChild = null;
  subsVerify = null;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private bs: BusyService,
    private pi: PageInfoService,
    private as: AuthService,
    private fs: FabService,
    public gs: GlobalService,
    public lms: LeftMenuService
  ) {
  }

  ngOnDestroy(): void {
    if (this.subsRouter) {
      this.subsRouter.unsubscribe();
    }
    if (this.subsRouterChild) {
      this.subsRouterChild.unsubscribe();
    }
    if (this.subsVerify) {
      this.subsVerify.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    this.lms.sideNav = this.leftSideNav;
  }

  ngOnInit(): void {
    this.gs.log(`[APP_BUILD_STATUS] 💘 ${environment.siteName} :: ${environment.production ? 'Production' : 'Development'} With Logging Enabled 📌`);
    this.pi.updatePageMetaData(
      '「💤 Hikki」',
      '「✨ Di Kamar Saja!」',
      '「💤 Hikki」, 「🌞 Hikikomori」',
      '/favicon.ico'
    );
    this.subsRouter = this.router.events.subscribe(e1 => {
      if (e1 instanceof RouteConfigLoadStart) {
        if (this.gs.isBrowser) {
          this.bs.busy();
        }
      }
      else if (e1 instanceof RouteConfigLoadEnd) {
        if (this.gs.isBrowser) {
          this.bs.idle();
        }
      }
      else if (e1 instanceof NavigationStart) {
        if (this.gs.isBrowser) {
          this.bs.busy();
        }
      }
      else if (e1 instanceof NavigationEnd) {
        let activatedRouteChild = this.route.firstChild;
        for (const aRC of activatedRouteChild.children) {
          activatedRouteChild = aRC;
        }
        this.subsRouterChild = activatedRouteChild.data.subscribe(e2 => {
          this.updateBackgroundImage();
          this.pi.updatePageMetaData(
            e2.title,
            e2.description,
            e2.keywords,
            this.selectedBackgroundImage ? this.selectedBackgroundImage : '/favicon.ico'
          );
          if (this.gs.isBrowser) {
            this.bs.idle();
            this.leftSideNavContent.nativeElement.scrollTop = 0;
            this.fs.removeFab();
            this.checkStorage();
          }
        });
      }
    });
  }

  updateBackgroundImage(): void {
    switch (this.router.url.substr(1).split('/').length) {
      case 1:
        if (this.router.url.startsWith('/verify') || this.router.url.startsWith('/about')) {
          this.selectedBackgroundImage = `/assets/img/bg-aboutverify.svg`;
        } else {
          this.selectedBackgroundImage = `/assets/img/router/bg-${this.router.url.substr(1).split('/')[0].split('?')[0]}.png`;
        }
        break;
      default:
        this.selectedBackgroundImage = ``;
    }
  }

  checkStorage(): void {
    const token = localStorage.getItem(environment.tokenName);
    if (token) {
      this.bs.busy();
      this.subsVerify = this.as.verify(token).subscribe(
        success => {
          this.gs.log('[VERIFY_SUCCESS]', success);
          this.bs.idle();
        },
        error => {
          this.gs.log('[VERIFY_ERROR]', error);
          this.bs.idle();
          this.as.removeUser();
        }
      );
    }
  }

}

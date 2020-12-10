import { Injectable } from '@angular/core';

import { GlobalService } from './global.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class GithubService {

  public portalVer = '0000000';

  constructor(
    private gs: GlobalService,
    private api: ApiService
  ) {
    if (this.gs.isBrowser) {
      this.api.getData('https://api.github.com/repos/Bifeldy/Hikki/commits').subscribe(
        res => {
          this.gs.log('[GITHUB_API]', res);
          this.portalVer = res[0].sha;
        },
        err => {
          this.gs.log('[GITHUB_API]', err);
        }
      );
    }
  }
}

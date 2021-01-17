import { Injectable } from '@angular/core';

import { ApiService } from './api.service';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(
    private api: ApiService,
    private gs: GlobalService
  ) {
    if (this.gs.isBrowser) {
      //
    }
  }

  getProject(): any {
    return this.api.getData(`/project`);
  }

  createProject(notifData): any {
    return this.api.postData('/project', notifData);
  }

  deleteProject(notifId): any {
    return this.api.deleteData(`/project/${notifId}`);
  }

}

import { Injectable } from '@angular/core';

import { ApiService } from './api.service';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  public menuList = [
    {
      url: 'banned-list',
      name: 'Banned List',
      image_url: null,
      icon: 'lock_open',
      deskripsi: 'Kelola Banned User'
    },
    {
      url: 'ddl-list',
      name: 'Berkas DDL',
      image_url: null,
      icon: 'insert_drive_file',
      deskripsi: 'Kelola Berkas DDL'
    },
    {
      url: 'fansub-member',
      name: 'Fansub Lead & Staff',
      image_url: null,
      icon: 'stars',
      deskripsi: 'Atur Keanggotaan Fansub'
    },
    {
      url: 'project-type',
      name: 'Project Type',
      image_url: null,
      icon: 'loyalty',
      deskripsi: 'Atur Kategori Garapan'
    },
    {
      url: 'push-notification',
      name: 'Push Notification',
      image_url: null,
      icon: 'notifications_active',
      deskripsi: 'Buat Pengumuman Dadakan'
    },
    {
      url: 'user-list',
      name: 'User List',
      image_url: null,
      icon: 'supervisor_account',
      deskripsi: 'Atur Seluruh Member'
    }
  ];

  constructor(
    private api: ApiService,
    private gs: GlobalService
  ) {
    if (this.gs.isBrowser) {
      //
    }
  }

  getAllNotif(q = '', page = 1, row = 10, sort = '', order = ''): any {
    return this.api.getData(`/notification?q=${q}&page=${page}&row=${row}&sort=${sort}&order=${order}`);
  }

  createNotif(notifData): any {
    return this.api.postData('/notification', notifData);
  }

  deleteNotif(notifId): any {
    return this.api.deleteData(`/notification/${notifId}`);
  }

  getAllBanned(q = '', page = 1, row = 10, sort = '', order = ''): any {
    return this.api.getData(`/banned?q=${q}&page=${page}&row=${row}&sort=${sort}&order=${order}`);
  }

  unBan(bannedId): any {
    return this.api.deleteData(`/banned/${bannedId}`);
  }

}
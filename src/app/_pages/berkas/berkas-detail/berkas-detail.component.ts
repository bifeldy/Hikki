import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BerkasService } from '../../../_shared/services/berkas.service';
import { GlobalService } from '../../../_shared/services/global.service';
import { PageInfoService } from '../../../_shared/services/page-info.service';
import { FabService } from '../../../_shared/services/fab.service';
import { BusyService } from '../../../_shared/services/busy.service';
import { AuthService } from '../../../_shared/services/auth.service';

import User from '../../../_shared/models/User';

import { saveAs } from 'file-saver';

@Component({
  selector: 'app-berkas-detail',
  templateUrl: './berkas-detail.component.html',
  styleUrls: ['./berkas-detail.component.css']
})
export class BerkasDetailComponent implements OnInit {

  berkasId = 0;
  berkasData = null;

  attachmentPercentage = 0;
  attachmentIsDownloading = false;
  attachmentIsCompleted = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private gs: GlobalService,
    private bs: BusyService,
    private pi: PageInfoService,
    private berkas: BerkasService,
    private fs: FabService,
    public as: AuthService
  ) {
  }

  get currentUser(): User {
    return this.as.currentUserValue;
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.berkasId = params.berkasId;
      this.bs.busy();
      this.berkas.getBerkas(this.berkasId).subscribe(
        res => {
          this.gs.log('[BERKAS_DETAIL_SUCCESS]', res);
          this.berkasData = res.result;
          this.pi.updatePageMetaData(
            `${this.berkasData.name}`,
            `${this.berkasData.description}`,
            `${this.berkasData.name}`,
            this.berkasData.image_url
          );
          this.bs.idle();
          this.fs.initializeFab('edit', null, 'Ubah Data Berkas', `/berkas/${this.berkasId}/edit`, false);
        },
        err => {
          this.gs.log('[BERKAS_DETAIL_ERROR]', err);
          this.bs.idle();
          this.router.navigate(['/error'], {
            queryParams: {
              returnUrl: '/'
            }
          });
        }
      );
    });
  }

  login(): void {
    this.router.navigate(['/login'], {
      queryParams: {
        returnUrl: `/berkas/${this.berkasId}`
      }
    });
  }

  verify(): void {
    this.router.navigate(['/verify'], {
      queryParams: {
        returnUrl: `/berkas/${this.berkasId}`
      }
    });
  }

  ddl(): void {
    this.attachmentIsDownloading = true;
    this.berkas.downloadLampiran(this.berkasData.attachment_.id).subscribe(
      event => {
        this.gs.log('[DOWNLOAD_EVENTS]', event);
        if ((event as any).loaded && (event as any).total) {
          const e = (event as any);
          this.gs.log('[DOWNLOAD_PROGRESS]', e);
          this.attachmentPercentage = Math.round(e.loaded / e.total * 100);
        }
        if ((event as any).body) {
          const e = (event as any);
          this.gs.log('[DOWNLOAD_COMPLETED]', e);
          this.attachmentIsDownloading = false;
          this.attachmentIsCompleted = true;
          saveAs(e.body, `${this.berkasData.attachment_.name}.${this.berkasData.attachment_.ext}`);
        }
      }
    );
  }

}

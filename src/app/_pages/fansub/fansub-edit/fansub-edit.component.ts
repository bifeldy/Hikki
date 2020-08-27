import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

import moment from 'moment';

import { GlobalService } from '../../../_shared/services/global.service';
import { PageInfoService } from '../../../_shared/services/page-info.service';
import { FansubService } from '../../../_shared/services/fansub.service';
import { BusyService } from '../../../_shared/services/busy.service';
import { ImgbbService } from '../../../_shared/services/imgbb.service';

@Component({
  selector: 'app-fansub-edit',
  templateUrl: './fansub-edit.component.html',
  styleUrls: ['./fansub-edit.component.css']
})
export class FansubEditComponent implements OnInit {

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  fansubId = 0;

  fg: FormGroup;

  submitted = false;

  image = null;
  imageErrorText = null;
  // tslint:disable-next-line: variable-name
  image_url = '/assets/img/form-no-image.png';
  // tslint:disable-next-line: variable-name
  image_url_original = null;

  urls = [];

  currentDate = new Date();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private bs: BusyService,
    private activatedRoute: ActivatedRoute,
    private gs: GlobalService,
    private pi: PageInfoService,
    private imgbb: ImgbbService,
    private fansub: FansubService
  ) {
    this.gs.bannerImg = '/assets/img/fansub-banner.png';
    this.gs.sizeContain = false;
    this.gs.bgRepeat = false;
  }

  ngOnInit(): void {
    this.pi.updatePageMetaData(
      `Fansub - Ubah Data`,
      `Halaman Pembaharuan Data Fansub`,
      `Ubah Fansub`
      );
    this.bs.busy();
    this.activatedRoute.params.subscribe(params => {
      this.fansubId = params.fansubId;
      this.fansub.getFansub(this.fansubId).subscribe(
        res => {
          this.gs.log('[FANSUB_DETAIL_SUCCESS]', res);
          this.initForm(res.result);
          this.bs.idle();
        },
        err => {
          this.gs.log('[FANSUB_DETAIL_ERROR]', err);
          this.bs.idle();
          this.router.navigate(['/error'], {
            queryParams: {
              returnUrl: `/fansub/${this.fansubId}`
            }
          });
        }
      );
    });
  }

  initForm(data): void {
    this.image_url = data.image_url;
    this.image_url_original = this.image_url;
    const urls = data.urls;
    const WEB = urls.find(u => u.name === 'web');
    const FACEBOOK = urls.find(u => u.name === 'facebook');
    const DISCORD = urls.find(u => u.name === 'discord');
    const ACTIVE = data.active === true ? '1' : '0';
    this.fg = this.fb.group({
      name: [data.name, Validators.compose([Validators.required, Validators.pattern(this.gs.allKeyboardKeysRegex)])],
      description: [data.description, Validators.compose([Validators.required, Validators.pattern(this.gs.allKeyboardKeysRegex)])],
      born: [data.born, Validators.compose([Validators.required, this.dateValidator, Validators.pattern(this.gs.allKeyboardKeysRegex)])],
      active: [ACTIVE, Validators.compose([Validators.required, Validators.pattern(this.gs.allKeyboardKeysRegex)])],
      slug: [data.slug, Validators.compose([Validators.required, Validators.pattern(this.gs.allKeyboardKeysRegex)])],
      tags: [data.tags, Validators.compose([])],
      image: [null, Validators.compose([Validators.pattern(this.gs.allKeyboardKeysRegex)])],
      web: [WEB ? WEB.url : null, Validators.compose([Validators.pattern(this.gs.allKeyboardKeysRegex)])],
      facebook: [FACEBOOK ? FACEBOOK.url : null, Validators.compose([Validators.pattern(this.gs.allKeyboardKeysRegex)])],
      discord: [DISCORD ? DISCORD.url : null, Validators.compose([Validators.pattern(this.gs.allKeyboardKeysRegex)])]
    });
  }

  dateValidator(AC: AbstractControl): any {
    if (AC && AC.value && !moment(AC.value, 'YYYY-MM-DD', true).isValid()) {
      return {
        dateVaidator: true
      };
    }
    return null;
  }

  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.fg.value.tags.push(value.trim());
    }
    if (input) {
      input.value = '';
    }
    this.fg.controls.tags.patchValue(this.fg.value.tags.filter((a, b, c) => c.findIndex(d => (d === a)) === b));
    this.fg.controls.tags.markAsDirty();
  }

  removeTag(tag: any): void {
    const index = this.fg.value.tags.indexOf(tag);
    if (index >= 0) {
      this.fg.value.tags.splice(index, 1);
    }
  }

  uploadImage(event): void {
    this.image = null;
    this.fg.controls.image.patchValue(null);
    const file = event.target.files[0];
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = e => {
        this.gs.log('[ImgLoad]', e);
        if (file.size < 256 * 1000) {
          const img = document.createElement('img');
          img.onload = () => {
            this.image = file;
            this.image_url = reader.result.toString();
          };
          img.src = reader.result.toString();
          this.imageErrorText = null;
        } else {
          this.image = null;
          this.image_url = '/assets/img/form-image-error.png';
          this.imageErrorText = 'Ukuran Upload File Melebihi Batas 256 KB!';
        }
      };
    } catch (error) {
      this.image = null;
      this.imageErrorText = null;
      this.image_url = this.image_url_original;
      this.fg.controls.image.markAsPristine();
    }
  }

  submitImage(): void {
    this.submitted = true;
    this.imgbb.uploadImage(this.image).subscribe(
      res => {
        this.gs.log('[IMAGE_SUCCESS]', res);
        this.fg.controls.image.patchValue(res.data.image.url);
        this.fg.controls.image.markAsDirty();
        this.submitted = false;
      },
      err => {
        this.gs.log('[IMAGE_ERROR]', err);
        this.fg.controls.image.patchValue(null);
        this.submitted = false;
      }
    );
  }

  onSubmit(): void {
    this.bs.busy();
    const urls = [];
    if (this.fg.value.web) {
      urls.push({ name: 'web', url: this.fg.value.web });
    }
    if (this.fg.value.facebook) {
      urls.push({ name: 'facebook', url: this.fg.value.facebook });
    }
    if (this.fg.value.discord) {
      urls.push({ name: 'discord', url: this.fg.value.discord });
    }
    const body = this.gs.getDirtyValues(this.fg);
    if ('web' in body) {
      delete body.web;
    }
    if ('facebook' in body) {
      delete body.facebook;
    }
    if ('discord' in body) {
      delete body.discord;
    }
    this.gs.log('[FANSUB_EDIT_DIRTY]', body);
    this.submitted = true;
    if (this.fg.invalid) {
      this.submitted = false;
      this.bs.idle();
      return;
    }
    this.fansub.updateFansub(this.fansubId, {
      data: window.btoa(JSON.stringify({
        ...body, urls
      }))
    }).subscribe(
      res => {
        this.gs.log('[FANSUB_EDIT_SUCCESS]', res);
        this.submitted = false;
        this.bs.idle();
        this.router.navigateByUrl(`/fansub/${this.fansubId}`);
      },
      err => {
        this.gs.log('[FANSUB_EDIT_ERROR]', err);
        this.submitted = false;
        this.bs.idle();
      }
    );
  }

}

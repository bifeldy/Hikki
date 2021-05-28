import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { SosMed } from '../../_shared/models/SosMed';

import { AuthService } from '../../_shared/services/auth.service';
import { GlobalService } from '../../_shared/services/global.service';
import { UserService } from '../../_shared/services/user.service';
import { BusyService } from '../../_shared/services/busy.service';
import { DialogService } from '../../_shared/services/dialog.service';
import { WinboxService } from '../../_shared/services/winbox.service';

import { environment } from '../../../environments/client/environment';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit, OnDestroy {

  fg1: FormGroup;
  fg2: FormGroup;

  submitted = false;

  verifyImg = '/assets/img/verify.png';
  verifyInfo = 'Verifikasi akunmu dan dapatkan fitur menarik lainnya~';

  kpuRiUserData = null;

  subsCekNik = null;
  subsVerify1 = null;
  subsVerify2 = null;
  subsSosmed = null;
  subsDialog = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private us: UserService,
    private bs: BusyService,
    private ds: DialogService,
    public gs: GlobalService,
    public route: ActivatedRoute,
    public as: AuthService,
    private wb: WinboxService
  ) {
    this.gs.bannerImg = null;
    this.gs.sizeContain = false;
    this.gs.bgRepeat = false;
  }

  ngOnDestroy(): void {
    this.subsCekNik?.unsubscribe();
    this.subsVerify1?.unsubscribe();
    this.subsVerify2?.unsubscribe();
    this.subsSosmed?.unsubscribe();
    this.subsDialog?.unsubscribe();
  }

  ngOnInit(): void {
    if (this.gs.isBrowser) {
      this.initKTP();
      const app = this.route.snapshot.queryParamMap.get('app');
      const code = this.route.snapshot.queryParamMap.get('code');
      if (app && code) {
        this.sosmedVerify(app, code);
      } else {
        if (this.as.currentUserValue && this.as.currentUserValue.verified) {
          this.router.navigateByUrl('/home');
        }
      }
    }
  }

  sosmedVerify(sosmedApp: string, oAuthCode: string): void {
    this.bs.busy();
    this.subsSosmed = this.us.sosmedLogin({
      app: sosmedApp.toUpperCase(),
      code: oAuthCode
    }).subscribe({
      next: res => {
        this.gs.log('[SOSMED]', res);
        this.bs.idle();
        this.subsDialog = this.ds.openInfoDialog({
          data: {
            title: res.result.title,
            htmlMessage: res.result.message,
            confirmText: 'Berhasil',
            cancelText: 'Coba Lagi'
          },
          disableClose: false
        }).afterClosed().subscribe({
          next: re => {
            if (re === true) {
              this.as.removeUser();
              this.router.navigateByUrl('/login');
            } else if (re === false) {
              if (sosmedApp.toUpperCase() === SosMed.DISCORD) {
                this.wb.winboxOpenUri(`https://discord.com/api/oauth2/authorize?redirect_uri=${encodeURIComponent(environment.baseUrl)}%2Fverify%3Fapp%3Ddiscord&client_id=${environment.discordClientId}&response_type=code&scope=identify%20email`, '_self');
              }
              // TODO :: If Other SosMed
            }
            this.subsDialog.unsubscribe();
          }
        });
      },
      error: err => {
        this.gs.log('[SOSMED]', err);
        this.bs.idle();
      }
    });
  }

  initKTP(): void {
    this.fg1 = this.fb.group({
      nik: [null, [Validators.required, Validators.pattern(/^\d+$/)]],
      nama: [null, [Validators.required, Validators.pattern('^[a-zA-Z. ]+$')]],
      completed: [null, [Validators.required]],
      'g-recaptcha-response': [null, [Validators.pattern(this.gs.allKeyboardKeysRegex)]],
    });
    this.fg2 = this.fb.group({
      nik: [null, [Validators.pattern(/^\d+$/)]],
      nama: [null, [Validators.pattern('^[a-zA-Z. ]+$')]],
      tempat_lahir: [null, [Validators.pattern('^[a-zA-Z ]+$')]],
      tanggal_lahir: [null, [Validators.pattern(this.gs.allKeyboardKeysRegex)]],
      jenis_kelamin: [null, [Validators.pattern('^[LP]+$')]],
      golongan_darah: [null, [Validators.pattern('^[ABO]+$')]],
      alamat: [null, [Validators.pattern(this.gs.allKeyboardKeysRegex)]],
      rt: [null, [Validators.pattern(/^\d+$/)]],
      rw: [null, [Validators.pattern(/^\d+$/)]],
      kelurahan_desa: [null, [Validators.pattern(this.gs.allKeyboardKeysRegex)]],
      kecamatan: [null, [Validators.pattern(this.gs.allKeyboardKeysRegex)]],
      agama: [null, [Validators.pattern(this.gs.allKeyboardKeysRegex)]],
      status_perkawinan: [null, [Validators.pattern(this.gs.allKeyboardKeysRegex)]],
      pekerjaan: [null, [Validators.pattern(this.gs.allKeyboardKeysRegex)]],
      kewarganegaraan: [null, [Validators.pattern('^[WNIA]+$')]],
    });
  }

  cekNIK(captchaResponse, captchaRef, stepper): void {
    this.gs.log(`[GOOGLE_CAPTCHA] ${captchaResponse}`);
    if (captchaResponse) {
      this.fg1.controls['g-recaptcha-response'].patchValue(captchaResponse);
      this.subsCekNik = this.us.cekNik({
        nik: this.fg1.value.nik,
        nama: this.fg1.value.nama,
        'g-recaptcha-response': this.fg1.value['g-recaptcha-response']
      }).subscribe({
        next: res => {
          this.gs.log('[KPU_RI-CEK_NIK]', res);
          if (res.result.message === 'success') {
            this.kpuRiUserData = { ...res.result.data, nik: this.fg1.value.nik};
            this.verifyInfo = `
              ${this.kpuRiUserData.nama} - ${this.kpuRiUserData.jenis_kelamin} - ${this.kpuRiUserData.tempat_lahir} -
              ${this.kpuRiUserData.nik} - ${this.kpuRiUserData.namaKel} - ${this.kpuRiUserData.namaKec} -
              ${this.kpuRiUserData.namaKabko} - ${this.kpuRiUserData.namaPropinsi}
            `.replace(/\n/g, ' ').replace(/ +(?= )/g, '').trim();
            this.fg2.controls.nik.patchValue(this.kpuRiUserData.nik);
            this.fg2.controls.nama.patchValue(this.kpuRiUserData.nama);
            this.fg2.controls.jenis_kelamin.patchValue(this.kpuRiUserData.jenis_kelamin);
            this.fg2.controls.tempat_lahir.patchValue(this.kpuRiUserData.tempat_lahir);
            this.fg2.controls.kelurahan_desa.patchValue(this.kpuRiUserData.namaKel);
            this.fg2.controls.kecamatan.patchValue(this.kpuRiUserData.namaKec);
            this.fg1.controls.completed.patchValue(true);
            stepper.next();
            captchaRef.reset();
          } else {
            this.verifyInfo = res.result.data.pesan;
            this.fg1.controls['g-recaptcha-response'].patchValue(null);
            this.fg1.controls.completed.patchValue(null);
            this.kpuRiUserData = null;
            captchaRef.reset();
          }
        }
      });
    }
  }

  submitKTP(stepper): void {
    this.bs.busy();
    this.submitted = true;
    const body = this.fg2.value;
    for (const propName in body) {
      if (body[propName] === null || body[propName] === undefined) {
        delete body[propName];
      }
    }
    this.subsVerify1 = this.us.verifikasi({
      ...body
    }).subscribe({
      next: res => {
        this.gs.log('[USER_VERIFIKASI_SUCCESS]', res);
        this.bs.idle();
        this.submitted = false;
        this.as.removeUser();
        this.bs.busy();
        this.subsVerify2 = this.as.verify(this.as.jwtToken).subscribe({
          next: success => {
            this.gs.log('[VERIFY_LOGIN_SUCCESS]', success);
            this.bs.idle();
            this.router.navigateByUrl(`/home`);
          },
          error: error => {
            this.gs.log('[VERIFY_LOGIN_ERROR]', error);
            this.bs.idle();
            this.as.removeUser();
            this.router.navigateByUrl(`/home`);
          }
        });
      },
      error: err => {
        this.gs.log('[USER_VERIFIKASI_ERROR]', err);
        this.bs.idle();
        this.submitted = false;
        this.verifyInfo = err.error.result.message;
        stepper.reset();
      }
    });
  }

}

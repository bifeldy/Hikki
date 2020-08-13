import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import * as CryptoJS from 'crypto-js';

import { environment } from '../../../environments/environment';

import { GlobalService } from '../../_shared/services/global.service';
import { AuthService } from '../../_shared/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  usernameUsed = null;
  emailUsed = null;

  fg: FormGroup;
  submitted = false;

  registerImg = '/assets/img/loginregister.png';
  bgRegisterImg = '/assets/img/bg-loginregister.svg';
  registerInfo = 'Ayo bergabung dan masuk dalam komunitas~';

  constructor(
    private fb: FormBuilder,
    private gs: GlobalService,
    private route: ActivatedRoute,
    private router: Router,
    public as: AuthService
  ) {
    if (this.as.currentUserValue) {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit(): void {
    this.fg = this.fb.group({
      username: [null, [Validators.required, Validators.minLength(5), Validators.pattern('^[a-z0-9]+$')]],
      name: [null, [Validators.required, Validators.pattern('^[a-zA-Z. ]+$')]],
      email: [null, [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
      password: [null, [Validators.required, Validators.minLength(5), Validators.pattern(this.gs.allKeyboardKeysRegex)]
      ],
      agree: [null, [Validators.required]]
    });
  }

  get registerFormVal(): any {
    return this.fg.controls;
  }

  onClickedSubmit(): void {
    this.submitted = true;
    this.registerInfo = 'Harap Menunggu ...';
    this.usernameUsed = null;
    this.emailUsed = null;
    this.gs.log('[REGISTER_FORM_REQUEST]', this.fg.value);
    if (this.fg.invalid) {
      this.registerInfo = 'Periksa Dan Isi Kembali Data Anda!';
      this.submitted = false;
      return;
    }
    if (this.fg.valid) {
      this.submitted = true;
      this.as.register({
        data: window.btoa(JSON.stringify({
          username: this.fg.value.username,
          name: this.fg.value.name,
          email: this.fg.value.email,
          password: CryptoJS.SHA512(this.fg.value.password).toString(),
          agree: this.fg.value.agree
        }))
      }).subscribe(
        (res: any) => {
          this.registerInfo = res.info;
          this.as.verify(localStorage.getItem(environment.tokenName)).subscribe(
            success => {
              this.registerInfo = success.info;
              this.gs.log('[VERIFY_REGISTER_SUCCESS]', success);
              this.router.navigateByUrl('/');
            },
            error => {
              this.gs.log('[VERIFY_REGISTER_ERROR]', error);
              this.as.logout();
            }
          );
        },
        err => {
          this.gs.log('[REGISTER_FORM_ERROR]', err);
          this.registerInfo = err.error.result.message || err.error.info;
          this.submitted = false;
          this.usernameUsed = err.error.result.username || null;
          this.emailUsed = err.error.result.email || null;
        }
      );
    }
  }

}
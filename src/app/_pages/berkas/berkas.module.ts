import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthGuard } from 'src/app/_shared/helpers/auth-guard';
import { SharedMaterialModule } from '../../_shared/helpers/shared-material.module';

import { MaterialTabModule } from '../../_shared/components/material-tab/material-tab.module';

import { Role } from 'src/app/_shared/models/Role';

import { BerkasCreateComponent } from './berkas-create/berkas-create.component';
import { BerkasDetailComponent } from './berkas-detail/berkas-detail.component';
import { BerkasEditComponent } from './berkas-edit/berkas-edit.component';
import { BerkasListComponent } from './berkas-list/berkas-list.component';

const routes: Routes = [
  {
    path: '',
    component: BerkasListComponent
  },
  {
    path: 'create',
    component: BerkasCreateComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Berkas - Buat Baru',
      description: 'Halaman Unggah Berkas Baru',
      keywords: 'Tambah Berkas Baru',
      roles: [Role.ADMIN, Role.FANSUBBER, Role.MODERATOR, Role.USER]
    }
  },
  {
    path: ':berkasId/edit',
    component: BerkasEditComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Berkas - Ubah Data',
      description: 'Halaman Pembaharuan Data Fansub',
      keywords: 'Ubah Berkas',
      roles: [Role.ADMIN, Role.FANSUBBER, Role.MODERATOR, Role.USER]
    }
  },
  {
    path: ':berkasId',
    component: BerkasDetailComponent
  }
];

@NgModule({
  declarations: [
    BerkasCreateComponent,
    BerkasDetailComponent,
    BerkasEditComponent,
    BerkasListComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedMaterialModule,
    MaterialTabModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class BerkasModule { }
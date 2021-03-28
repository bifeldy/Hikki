import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { NotificationsModule } from '../../_shared/components/notifications/notifications.module';
import { StatsServerModule } from '../../_shared/components/stats-server/stats-server.module';
import { SharedMaterialModule } from '../../_shared/helpers/shared-material.module';
import { BannerDiscordModule } from '../../_shared/components/banner-discord/banner-discord.module';
import { BannerNihongoModule } from '../../_shared/components/banner-nihongo/banner-nihongo.module';
import { DiscussionModule } from '../../_shared/components/discussion/discussion.module';

import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent
  }
];

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    BannerDiscordModule,
    BannerNihongoModule,
    StatsServerModule,
    NotificationsModule,
    SharedMaterialModule,
    DiscussionModule
  ]
})
export class HomeModule { }

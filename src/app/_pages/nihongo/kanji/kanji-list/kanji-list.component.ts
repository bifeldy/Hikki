import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';

import { GlobalService } from '../../../../_shared/services/global.service';
import { BusyService } from '../../../../_shared/services/busy.service';
import { NihongoService } from '../../../../_shared/services/nihongo.service';

@Component({
  selector: 'app-kanji-list',
  templateUrl: './kanji-list.component.html',
  styleUrls: ['./kanji-list.component.css']
})
export class KanjiListComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  pageSizeOptions = [50, 75, 100, 125, 150];

  jlpt = '';
  school = '';

  count = 0;
  page = 1;
  row = 50;

  q = '';
  sort = '';
  order = '';

  kanjiData = [];

  subsKanji = null;

  constructor(
    private gs: GlobalService,
    private bs: BusyService,
    private nihon: NihongoService
  ) {
  }

  ngOnInit(): void {
    if (this.gs.isBrowser) {
      this.getKanji();
    }
  }

  ngOnDestroy(): void {
    if (this.subsKanji) {
      this.subsKanji.unsubscribe();
    }
  }

  changeJlpt(data): void {
    this.gs.log('[JLPT_CHANGE]', data);
    this.jlpt = data;
    this.resetPaginator();
  }

  changeSchool(data): void {
    this.gs.log('[SCHOOL_CHANGE]', data);
    this.school = data;
    this.resetPaginator();
  }

  applyFilter(event): void {
    this.gs.log('[SEARCH_VALUE_CHANGED]', event);
    this.q = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.resetPaginator();
  }

  paginatorChanged(data): void {
    this.gs.log('[PAGINATOR_VALUE_CHANGED]', data);
    this.page = data.pageIndex + 1;
    this.row = data.pageSize;
    this.getKanji();
  }

  resetPaginator(): void {
    this.paginator._changePageSize(this.pageSizeOptions[0]);
    this.paginator.firstPage();
  }

  getKanji(): void {
    this.bs.busy();
    if (this.subsKanji) {
      this.subsKanji.unsubscribe();
      this.bs.idle();
    }
    this.subsKanji = this.nihon.getAllKanji(
      this.jlpt, this.school, this.q, this.page, this.row, 'context', 'asc'
    ).subscribe(
      res => {
        this.gs.log('[KANJI_LIST_SUCCESS]', res);
        this.count = res.count;
        this.kanjiData = res.results;
        this.bs.idle();
      },
      err => {
        this.gs.log('[KANJI_LIST_ERROR]', err);
        this.bs.idle();
      }
    );
  }

}

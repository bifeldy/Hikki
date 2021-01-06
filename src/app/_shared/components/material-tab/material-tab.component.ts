import { Component, OnInit, ViewChild, AfterViewInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { Router } from '@angular/router';

import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-material-tab',
  templateUrl: './material-tab.component.html',
  styleUrls: ['./material-tab.component.css']
})
export class MaterialTabComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() count = 0;
  @Input() serverSide = false;
  @Output() serverSideFilter = new EventEmitter();
  @Output() serverSideOrder = new EventEmitter();

  SWIPE_ACTION = { LEFT: 'swipeleft', RIGHT: 'swiperight' };

  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

  selectedIndexTab = 0;
  totalTabsCount = 2;

  urlPath = null;

  @Input() tabData: any = [
    // {
    //   name: 'Anime Fansub',
    //   icon: 'closed_caption',
    //   type: 'grid', // list & grid
    //   data: [
    //     { title: 'Data Title 01', description: 'Data Description 01' },
    //     { title: 'Data Title 02', description: 'Data Description 02' }
    //   ]
    // },
    // {
    //   name: 'Berkas',
    //   icon: 'file_copy',
    //   type: 'table',
    //   data: {
    //     column: ['Tanggal Upload', 'Nama File', 'Pemilik'],
    //     row: [
    //       {
    //         NamaFile: '[FanSub] Berkas Dengan Judul Anime - 01 [BD][1080p].mkv',
    //         Pemilik: 'Bifeldy',
    //         Tanggal: '12:34:56 AM JST+9'
    //       }
    //     ]
    //   }
    // },
    // {
    //   name: 'Garapan',
    //   icon: 'closed_caption',
    //   type: 'table',
    //   data: {
    //     column: ['Jenis', 'Judul Anime', 'Nama Fansub'],
    //     row: [
    //       {
    //         Jenis: 'TV',
    //         'Judul Anime': 'Judul Anime SPECIAL Yang Biasanya Sangat Panjang',
    //         'Nama Fansub': [
    //           { id: 1, name: 'Bifeldy', router: '/', selected: true, color: Warna.BIRU },
    //           { id: 2, name: 'Fansub Lain', router: '/', selected: true, color: Warna.UNGU },
    //         ]
    //       }
    //     ]
    //   }
    // }
  ];

  @Output() chipClicked = new EventEmitter();
  @Output() gridClicked = new EventEmitter();
  @Output() listClicked = new EventEmitter();
  @Output() tableRowClicked = new EventEmitter();
  @Output() paginatorClicked = new EventEmitter();

  constructor(
    private router: Router,
    public gs: GlobalService
  ) {
    if (this.gs.isBrowser) {
      //
    }
  }

  ngOnInit(): void {
    this.urlPath = this.router.url;
    if (this.gs.isBrowser) {
      //
    }
  }

  ngAfterViewInit(): void {
    this.totalTabsCount = this.tabData.length;
  }

  ngOnDestroy(): void {
    this.urlPath = null;
  }

  swipe(eType): void {
    if (eType === this.SWIPE_ACTION.RIGHT && this.selectedIndexTab > 0) {
      this.selectedIndexTab--;
    }
    else if (eType === this.SWIPE_ACTION.LEFT && this.selectedIndexTab < this.totalTabsCount) {
      this.selectedIndexTab++;
    }
  }

  onGridClicked(data: any): void {
    this.gridClicked.emit(data);
  }

  onListClicked(data: any): void {
    this.listClicked.emit(data);
  }

  onTableRowClicked(data: any): void {
    this.tableRowClicked.emit(data);
  }

  onChipClicked(data: any): void {
    this.chipClicked.emit(data);
  }

  onPaginatorClicked(data: any): void {
    this.paginatorClicked.emit(data);
  }

  onServerSideFilter(data: any): void {
    this.serverSideFilter.emit(data);
  }

  onServerSideOrder(data: any): void {
    this.serverSideOrder.emit(data);
  }

}

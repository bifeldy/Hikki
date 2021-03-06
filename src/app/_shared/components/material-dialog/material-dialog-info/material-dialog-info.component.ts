import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { GlobalService } from '../../../../_shared/services/global.service';

import { DialogInfoData } from '../../../models/Dialog';

@Component({
  selector: 'app-material-dialog-info',
  templateUrl: './material-dialog-info.component.html',
  styleUrls: ['./material-dialog-info.component.css']
})
export class MaterialDialogInfoComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogInfoData,
    public gs: GlobalService
  ) {
    if (this.gs.isBrowser) {
      //
    }
  }

  ngOnInit(): void {
    this.gs.log('[DIALOG_DATA_IN]', this.data);
  }

}

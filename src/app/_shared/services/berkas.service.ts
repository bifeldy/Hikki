import { Injectable } from '@angular/core';

import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class BerkasService {

  constructor(
    private api: ApiService
  ) {
  }

  getAllBerkas(q = null, page = 1, row = 10): any {
    return this.api.getData(`/berkas?q=${q}&page=${page}&row=${row}`);
  }

  getBerkas(berkasId: number): any {
    return this.api.getData(`/berkas/${berkasId}`);
  }

  createBerkas(encryptedBerkasData): any {
    return this.api.postData(`/berkas`, encryptedBerkasData);
  }

  updateBerkas(berkasId, encryptedBerkasData): any {
    return this.api.putData(`/berkas/${berkasId}`, encryptedBerkasData);
  }

  uploadLampiran(lampiran): any {
    return this.api.uploadFile(`/attachment`, lampiran);
  }

  downloadLampiran(lampiranId): any {
    return this.api.downloadFile(`/attachment?id=${lampiranId}`);
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PoTableColumn } from '@po-ui/ng-components';
import jsonconfig from '../../assets/appConfig.json';

@Injectable({
  providedIn: 'root'
})
export class NotificacoesService {

  // Depois trocar para o a configuracao padrao
  url = 'api/protheus/dbdataproviders/v1/data'
  server: string;
  qrymultas = '';

  constructor(private http: HttpClient) { }

  public execPost(dataDe,dataAte): Observable<any> {
    dataDe = dataDe.replace(/-/g, '');
    dataAte = dataAte.replace(/-/g, '');
    this.server = jsonconfig['serverBackend'];

    this.getQuery(dataDe, dataAte);

    return this.http.post(this.server + this.url,
      {
        "sentenceMember": {
          "sqlText": this.qrymultas,
          "sqlParameters": [
          ],
          "maxRecords": 9999999999
        }
      }
    );
  }

  public getColumns(): Array<PoTableColumn> {
    return [
      { property: 'Z69_PLACA' , label: 'Placa'      , type: 'string' },
      { property: 'Z69_RENAVA', label: 'Renavam'    , type: 'string' },
      { property: 'Z69_DATA'  , label: 'Data'       , type: 'date' },
      { property: 'Z69_LOCAL' , label: 'Local'      , type: 'string' },
      { property: 'Z69_COMPLE', label: 'Complemento', type: 'string' },
      { property: 'Z69_DESCRI', label: 'Infração'   , type: 'string' },
    ];
  }

  getQuery(dataDe, dataAte) {
    this.qrymultas = "SELECT RTRIM(Z69_SITUA) Z69_SITUA, Z69_PLACA, Z69_RENAVA, Z69_DATA, Z69_HORA, Z69_LOCAL, Z69_COMPLE, Z69_DESCRI, Z69_VLRNOM, Z69_VLRATU, Z69_GUIA, Z69_ORIGEM FROM Z69010 ";
    this.qrymultas += " WHERE D_E_L_E_T_ = '' AND Z69_DATA BETWEEN '"+dataDe+"' AND '"+dataAte+"' AND Z69_TIPO = 'N' ORDER BY Z69_PLACA ";
  }

}

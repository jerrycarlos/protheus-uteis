import { Injectable } from '@angular/core';
import { PoTableColumn } from '@po-ui/ng-components';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import jsonconfig from '../../assets/appConfig.json';

@Injectable({
  providedIn: 'root'
})
export class MultasService {

  // Depois trocar para o a configuracao padrao
  url = 'api/protheus/dbdataproviders/v1/data';
  server: string;
  dataDe = '20160101';
  dataAte = '20201026';
  qrymultas = '';

  constructor(private http: HttpClient) { }

  public execPost(query = this.qrymultas, dataDe, dataAte): Observable<any> {
    dataDe = dataDe.replace(/-/g, '');
    dataAte = dataAte.replace(/-/g, '');
    this.server = jsonconfig['serverBackend'];
    this.dataDe = ( dataDe == undefined ? this.dataDe : dataDe)
    this.dataAte = ( dataAte == undefined ? this.dataAte : dataAte)

    this.setQuery(this.dataDe,this.dataAte)

    return this.http.post(this.server + this.url,
      {
        "sentenceMember": {
          "sqlText": query,
          "sqlParameters": [{
            "paramName": "xparam",
            "paramValue": "",
            "paramType": "system.string"
          }],
          "maxRecords": 9999999999
        }
      }
    );
  }

  public execPost1(query = this.qrymultas, dataDe, dataAte): Observable<any> {
    dataDe = dataDe.replace(/-/g, '');
    dataAte = dataAte.replace(/-/g, '');
    this.server = jsonconfig['serverBackend'];
    this.dataDe = ( dataDe == undefined ? this.dataDe : dataDe)
    this.dataAte = ( dataAte == undefined ? this.dataAte : dataAte)

    this.setQuery(this.dataDe,this.dataAte)

    return this.http.post(this.server + 'api/protheus/dbdataproviders/v1/schema/sql',
      {
        "sqlText": query,
          "sqlParameters": [{
            "paramName": "xparam",
            "paramValue": "",
            "paramType": "system.string"
          }]
        }
    );
  }

  setQuery(dataDe, dataAte){
    this.qrymultas = "select E2_NUMBOR, E2_NUM, E2_TIPO, E2_DTBORDE, E2_ORIGEM from SE2010 where D_E_L_E_T_=:xparam and E2_NUM='000022124' and E2_TIPO='NF'";
    console.log(this.qrymultas)
  }

  public getColumns(): Array<PoTableColumn> {
    return [


      {
        property: "E2_FILIAL",
        label: "E2_FILIAL",
        type: "string"
    },
    {
        property: "E2_NUM",
        label: "E2_NUM",
        type: "string"
    },
    {
        property: "E2_PREFIXO",
        label: "E2_PREFIXO",
        type: "string"
    },
    {
        property: "E2_TIPO",
        label: "E2_TIPO",
        type: "string"
    },
    {
        property: "E2_PARCELA",
        label: "E2_PARCELA",
        type: "string"
    },
    {
        property: "E2_FORNECE",
        label: "E2_FORNECE",
        type: "string"
    },
    {
        property: "E2_LOJA",
        label: "E2_LOJA",
        type: "string"
    },
    {
        property: "E2_VALOR",
        label: "E2_VALOR",
        type: "float"
    },
    {
        property: "E2_X_VLR01",
        label: "E2_X_VLR01",
        type: "float"
    },
    {
        property: "E2_XHISTRO",
        label: "E2_XHISTRO",
        type: "string"
    },
    {
        property: "E2_DECRESC",
        label: "E2_DECRESC",
        type: "float"
    },
    {
        property: "E2_ACRESC",
        label: "E2_ACRESC",
        type: "float"
    }
    ];
  }

}

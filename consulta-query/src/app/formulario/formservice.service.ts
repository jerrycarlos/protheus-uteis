import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import jsonconfig from '../../assets/appConfig.json';
import btoa from 'Base64'
@Injectable({
  providedIn: 'root'
})
export class FormserviceService {

  server: string;
  urlpost: string;
  urlnovo: string;
  
  constructor(private http: HttpClient) { }

  public execPost(recno): Observable<any> {
    
    this.server = jsonconfig['serverBackend'];
    this.urlpost = this.server + 'api/protheus/dbdataproviders/v1/data'

    const qrymultas = " SELECT *, ( SELECT TOP 1 Z68_MAT + ' / ' + Z68_NOME  FROM Z68010 Z68 (nolock)  WHERE Z68.D_E_L_E_T_ <> '*' AND Z68_PLACA=Z69_PLACA AND Z69_DATA between Z68_DATA and Z68_DATAFI AND Z69_HORA between LEFT(Z68_HORA,5) and LEFT(Z68_HORAFI,5) ORDER BY R_E_C_N_O_ DESC ) AS MOTORISTA FROM Z69010 Z69 WHERE R_E_C_N_O_ = :recno";
    return this.http.post(this.urlpost,
      {
        "sentenceMember": {
          "sqlText": qrymultas,
          "sqlParameters": [
            {
              "paramName":"recno",
              "paramValue":recno,
              "paramType":"system.Int32"

            }
          ],
          "maxRecords": 9999999999
        }
      }
    );
  }

  postNovoDado(body: string ) {
    this.server = jsonconfig['serverBackend'];
    this.urlnovo = this.server + 'controlemultas';
    return this.http.post(this.urlnovo, body);
  }
}

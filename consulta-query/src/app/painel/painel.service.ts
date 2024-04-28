import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PoTableColumn } from '@po-ui/ng-components';
import jsonconfig from '../../assets/appConfig.json';

@Injectable({
  providedIn: 'root'
})
export class PainelService {
    
  //depois trocar para o a configuracao padrao
  url = 'api/protheus/dbdataproviders/v1/data'
  server = '';
  qrymultas = '';
  porta = '';
  userid = '';
  dataDe = '20200101';
  dataAte = '20201019';
  querys = [];

  constructor(private http: HttpClient) { }
  

  public execPost(query): Observable<any> {
    this.querys = this.atualizaQry()
    this.server = jsonconfig['serverBackend'];
    
    this.selectmultas()       
    this.querys[11] = this.qrymultas;
    
    return this.http.post(this.server + this.url,
      {
        "sentenceMember": {      
          "sqlText": this.querys[query],
          "sqlParameters": [            
          ],
          "maxRecords": 9999999999
        }
      }      
    );
  }

  public getColInfra(): Array<PoTableColumn> {
    return [
      { property: 'QTD'     , label: 'Quantidade'},
      { property: 'INFRACAO', label: 'Infração' }
    ];
  }

  public getColMotor(): Array<PoTableColumn> {
    return [
      { property: 'MOTORISTA'     , label: 'Motorista'},
      { property: 'VALOR'         , label: 'Valor' }
    ];
  }

  selectmultas(){
    this.qrymultas = '';
    this.qrymultas += ' SELECT SUM(VALOR) VALOR, Z68_NOME MOTORISTA, Z68_MAT MATRICULA FROM (';
    this.qrymultas += ' SELECT Z68_NOME, Z68_MAT, ';
    this.qrymultas += ' COALESCE(';
    this.qrymultas += ' (';
    this.qrymultas += " SELECT SUM(Z69_VLRATU) FROM Z69010 WHERE D_E_L_E_T_ = '' "
    this.qrymultas += '  ';
    this.qrymultas += ' AND Z69_DATA BETWEEN Z68_DATA AND Z68_DATAFI';
    this.qrymultas += ' AND Z69_HORA BETWEEN LEFT(Z68_HORA,6) AND LEFT(Z68_HORAFI,6)';
    this.qrymultas += '      AND Z69_PLACA = Z68_PLACA'   ;
    this.qrymultas += ' ),0) AS VALOR'    ;
    this.qrymultas += ' FROM Z68010 Z68';
    this.qrymultas += " WHERE D_E_L_E_T_ = ''";
    this.qrymultas += ' GROUP BY Z68_NOME, Z68_DATA, Z68_DATAFI, Z68_PLACA, Z68_HORA, Z68_HORAFI, Z68_MAT  ) SQL '   ;
    this.qrymultas += ' GROUP BY Z68_NOME, Z68_MAT'    ;
    this.qrymultas += ' HAVING SUM(VALOR) > 0' ;      
  }

  setDate(dataDe, dataAte){
    this.dataDe = dataDe
    this.dataAte = dataAte
  }

  atualizaQry(){
    let querys = [
      " SELECT COUNT(*) QTD FROM DA3010 WHERE D_E_L_E_T_ = '' AND DA3_ATIVO = '1'",
      " SELECT SUM(Z69_VLRATU) VALORMULTA FROM Z69010 WHERE D_E_L_E_T_ = '' AND Z69_VENCTO BETWEEN '"+this.dataDe+"' AND '"+this.dataAte+"'",    
      " SELECT COUNT(*) QTD FROM Z69010 WHERE D_E_L_E_T_ = '' AND Z69_VENCTO BETWEEN '"+this.dataDe+"' AND '"+this.dataAte+"' AND Z69_TIPO = 'N' AND RTRIM(Z69_SITUA) = 'Em aberto' ",
      " SELECT COUNT(*) QTD FROM Z69010 WHERE D_E_L_E_T_ = '' AND Z69_VENCTO BETWEEN '"+this.dataDe+"' AND '"+this.dataAte+"' AND Z69_TIPO = 'N' AND RTRIM(Z69_SITUA) = 'Paga' ",
      " SELECT COUNT(*) QTD FROM Z69010 WHERE D_E_L_E_T_ = '' AND Z69_VENCTO BETWEEN '"+this.dataDe+"' AND '"+this.dataAte+"' AND Z69_TIPO = 'M' AND RTRIM(Z69_SITUA) = 'Em aberto' ",
      " SELECT COUNT(*) QTD FROM Z69010 WHERE D_E_L_E_T_ = '' AND Z69_VENCTO BETWEEN '"+this.dataDe+"' AND '"+this.dataAte+"' AND Z69_TIPO = 'M' AND RTRIM(Z69_SITUA) = 'Paga' ",
      " SELECT SUM(Z69_VLRATU) VALOR FROM Z69010 WHERE D_E_L_E_T_ = '' AND Z69_VENCTO BETWEEN '"+this.dataDe+"' AND '"+this.dataAte+"' AND Z69_TIPO = 'M' AND RTRIM(Z69_SITUA) = 'Em aberto' ",
      " SELECT SUM(Z69_VLRATU) VALOR FROM Z69010 WHERE D_E_L_E_T_ = '' AND Z69_VENCTO BETWEEN '"+this.dataDe+"' AND '"+this.dataAte+"' AND Z69_TIPO = 'M' AND RTRIM(Z69_SITUA) = 'Paga' ",
      " SELECT SUM(Z69_VLRATU) AS VALOR FROM Z69010 WHERE D_E_L_E_T_ = '' AND Z69_VENCTO BETWEEN '"+this.dataDe+"' AND '"+this.dataAte+"' AND Z69_TIPO = 'M' AND RTRIM(Z69_SITUA) = 'Em aberto' AND MONTH(Z69_VENCTO) = MONTH(GETDATE()) AND YEAR(Z69_VENCTO) = YEAR(GETDATE())",
      " SELECT TOP 10 SUM(Z69_VLRATU) TOTAL, RTRIM(Z69_LOCAL) LOCAL FROM Z69010 WHERE D_E_L_E_T_ = '' AND Z69_VENCTO BETWEEN '"+this.dataDe+"' AND '"+this.dataAte+"' AND Z69_TIPO = 'M' GROUP BY Z69_LOCAL ORDER BY 1 DESC",
      " SELECT TOP 10 COUNT(*) QTD, Z69_DESCRI INFRACAO FROM Z69010 WHERE D_E_L_E_T_ = '' AND Z69_VENCTO BETWEEN '"+this.dataDe+"' AND '"+this.dataAte+"' GROUP BY Z69_DESCRI ORDER BY 1 DESC ",             
      "",
      "SELECT AVG(VALOR) MEDIAPORMES FROM ( SELECT MONTH(Z69_VENCTO) MES,SUM(Z69_VLRATU) VALOR FROM Z69010 WHERE D_E_L_E_T_ = '' AND Z69_DATA BETWEEN '"+this.dataDe+"' AND '"+this.dataAte+"' AND Z69_TIPO='M' GROUP BY MONTH(Z69_VENCTO) ) AS AVGTAB ",
      "SELECT nomemes,valor from ( SELECT CAST(YEAR(Z69_VENCTO) AS varchar(4))+'/'+ CAST(MONTH(Z69_VENCTO) AS varchar(2)) AS nomemes, year(Z69_VENCTO) as ano, month(Z69_VENCTO) AS mesn, SUM(Z69_VLRATU) AS valor FROM     Z69010 WHERE D_E_L_E_T_ <> '*' AND Z69_TIPO='M' AND Z69_VENCTO BETWEEN '"+this.dataDe+"' AND '"+this.dataAte+"' GROUP BY YEAR(Z69_VENCTO), MONTH(Z69_VENCTO) ) as aux order by ano,mesn"
    ];
    return querys;
  }
}

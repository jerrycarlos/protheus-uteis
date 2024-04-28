import { Component, OnInit } from '@angular/core';
import { ChartDataSets  } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { PainelService } from './painel.service';
import { NgxCompactNumberService } from 'ngx-compact-number';

@Component({
  selector: 'app-painel',
  templateUrl: './painel.component.html',
  styleUrls: ['./painel.component.css']
})
export class PainelComponent implements OnInit {

  qtdveiculos: string = '0';
  mediaporveiculo: string = '0';
  notificacoespagas: string = '0';
  notificacoesabertas: string = '0';
  qtdmultaspagas: string = '0';
  qtdmultasabertas: string = '0';
  vlrmultasabertas = 0;
  vlrmultaspagas = 0;
  vlrmultasvincendo = 0;
  mediapormes = 0;

  infracaoporLocalData: ChartDataSets[] = [{ data: [], label: '' },];
  infracaoporLocalLabels: Label[] = [];  
  infracao: ChartDataSets;
  
  valorporMesData: ChartDataSets[] = [{ data: [], label: '' },];
  valorporMesLocalLabels: Label[] = [];  
  valormes: ChartDataSets;
  userid = ''
  porta = ''
  dados: Array<any>;
  dadosmeses: Array<any>;
  locais: Array<any>;
  filters:Array<Object> = [{ property: 'dataDe',label: 'Data de', type: 'date' }, { property: 'dataAte',label: 'Data até', type: 'date' }];
 
  meses: Array<any>;

  colinfracoes: Array<any>;
  topinfracoes: Array<any> = new Array();
  colmotoristas: Array<any>;
  topmotoristas: Array<any> = new Array();

  constructor(private painel: PainelService, private compactNumberService: NgxCompactNumberService) {}

  ngOnInit() {
    const urlParams = new URLSearchParams(window.location.search);
    const porta = urlParams.get('porta');
    const userid = urlParams.get('userid');

    if (porta != null && porta !== undefined && porta !== '' ) {
      sessionStorage.setItem('port', porta);
    }
    if (userid != null) {
      sessionStorage.setItem('userid', userid);
    }

    this.userid = sessionStorage.getItem('userid');
    this.porta = sessionStorage.getItem('port');
    console.log(this.userid);
    console.log(this.porta);
    this.updatepainel();
  }

  updatepainel(): void {

    //Quantidade de veiculos
    this.painel.execPost(0).subscribe(response => {
      this.qtdveiculos = JSON.parse(response.data)[0]["QTD"];   
      //Valor da multa media por veiculo
      this.painel.execPost(1).subscribe(response => {
        this.mediaporveiculo = JSON.parse(response.data)[0]["VALORMULTA"];   
        this.mediaporveiculo = (parseFloat(this.mediaporveiculo) / parseInt(this.qtdveiculos)).toFixed(2);
      });

    });

    //qtd notificacoes em abertas
    this.painel.execPost(2).subscribe(response => {
      this.notificacoesabertas = JSON.parse(response.data)[0]["QTD"];         
    });

    //qtd notificacoes pagas
    this.painel.execPost(3).subscribe(response => {
      this.notificacoespagas = JSON.parse(response.data)[0]["QTD"];         
    });
   
    //qtd de multas em abertas
    this.painel.execPost(4).subscribe(response => {
      this.qtdmultasabertas = JSON.parse(response.data)[0]["QTD"];               
    });

    //qtd de multas pagas
    this.painel.execPost(5).subscribe(response => {
      this.qtdmultaspagas = JSON.parse(response.data)[0]["QTD"];               
    });

    //valor de multas em abertas
    this.painel.execPost(6).subscribe(response => {      
      this.vlrmultasabertas = JSON.parse(response.data)[0]["VALOR"];               
      this.compactNumberService.format(this.vlrmultasabertas, 0)
    });

    //valor de multas pagas
    this.painel.execPost(7).subscribe(response => {
      this.vlrmultaspagas = JSON.parse(response.data)[0]["VALOR"];               
      this.compactNumberService.format(this.vlrmultaspagas,0)
    });

    //valor de multas vincendo
    this.painel.execPost(8).subscribe(response => {      
      this.vlrmultasvincendo = JSON.parse(response.data)[0]["VALOR"];               
      this.compactNumberService.format(this.vlrmultasvincendo,0)
    });

    //lista infracoes por local
    this.painel.execPost(9).subscribe(response => {      
      this.dados = JSON.parse(response.data).map(function(dado){      
        return dado["TOTAL"];
       }  
      );

    this.locais = JSON.parse(response.data).map(function(dado){      
      return dado["LOCAL"].substring(0,10);
     }
     
    );               
          
    this.infracao = {data: this.dados, label: 'Valores por Local' };
    this.infracaoporLocalData = [this.infracao];
    this.infracaoporLocalLabels = this.locais

    });
    
    //Valores por mes
    this.painel.execPost(13).subscribe(response => {            
      this.dadosmeses = JSON.parse(response.data).map(function(dado){    
        console.log(dado)  
        return dado["VALOR"];
       }  
      );

    this.meses = JSON.parse(response.data).map(function(dado){      
      return dado["NOMEMES"];
     }
    );               
          
    this.valormes = {data: this.dadosmeses, label: 'Valores por Local' };
    this.valorporMesData = [this.valormes];    
    this.valorporMesLocalLabels = this.meses;
    });

    this.colinfracoes = this.painel.getColInfra();

    this.painel.execPost(10).subscribe(response => {
      this.topinfracoes = JSON.parse(response.data);     
     });    

     this.colmotoristas = this.painel.getColMotor();

    this.painel.execPost(11).subscribe(response => {
      this.topmotoristas = JSON.parse(response.data);     
     });    

    this.painel.execPost(12).subscribe(response => {
      this.mediapormes = JSON.parse(response.data)[0]['MEDIAPORMES'].toFixed(2);     
     });    
  }

  ChartOptions = {
    responsive: true,
  };

  valorPorMesColors: Color[] = [
    {     
      borderColor: '#B6E3E9',
      backgroundColor: 'rgba(133,193,191,0)',
      pointBackgroundColor: 'Black'
    },
  ];

  infracaoporLocalColors: Color[] = [
    {           
      backgroundColor: 'rgba(122,180,184,10)',      
    },
  ];

  ChartLegend = true;
  
  buscar(filtro){
    const dataDe = filtro.dataDe.replace(/-/g, '')
    const dataAte = filtro.dataAte.replace(/-/g, '')
    
    this.painel.setDate(dataDe, dataAte)
    this.updatepainel()
  }


}

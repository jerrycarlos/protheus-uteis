import { Component, OnInit, ViewChild  } from '@angular/core';
import { PoTableColumn, PoCheckboxGroupOption, PoModalAction, PoModalComponent, PoPageFilter, PoPageAction, PoPopupComponent, PoTableComponent } from '@po-ui/ng-components';
import { MultasService } from './multas.service';
import { Router } from '@angular/router';
import { QWebChannel } from '@totvs/twebchannel-js';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-multas',
  templateUrl: './multas.component.html',
  styleUrls: ['./multas.component.css']
})
export class MultasComponent implements OnInit {

  colmultas: Array<PoTableColumn>;
  dadosmultas: Array<object>;
  dadosaux: Array<object>;
  statusOptions: Array<PoCheckboxGroupOption>;
  carregando: boolean = true;
  consulta: "SELECT distinct ZCY_TIPOAG, CR_FILIAL, CR_NUM, CR_USER, CR_STATUS, CR_DATALIB, CR_DTLIMIT, CR_HRLIMIT FROM SCR010 SCR  INNER JOIN ZCY010 ZCY on ZCY_NUMOS+ZCY_WF = CR_NUM and ZCY.D_E_L_E_T_='' WHERE SCR.D_E_L_E_T_=:xparam AND CR_TIPO='ZY' and CR_EMISSAO >= '20231101' AND CR_NIVEL='02' AND LEFT(CR_NUM,6) IN ('000279','000277','000275','000280','000282','000283','000364','000374','000373','000372','000371','000370','000369','000365','000359','000356','000909','000863','000862','001151','001636','001620','001615','001614','001504','001746','001744','001750','001748','001481','001933') and ZCY_TIPOAG='D' order by CR_FILIAL, CR_NUM";
  filtro: string = '';
  jsonColunas: string = '';
  filtroaux = [];
  porta = '';
  userid = '';
  dataDe;
  dataAte;
  col_e_items:any;
  pageactions: Array<PoPageAction> = [
    {label: 'Incluir'  , action: this.incluir.bind(this)},
    {label: 'Consultar', action: this.consultar.bind(this)},
    {label: 'Exportar PDF', action: this.exportarTabela.bind(this, 'pdf') },
    {label: 'Exportar CSV', action: this.exportarTabela.bind(this, 'csv') },
  ];

  close: PoModalAction = {
    action: () => {
      this.poModal.close();
    },
    label: 'Fechar',
    danger: true
  };

  confirm: PoModalAction = {
    action: () => {
      this.atualizarlista();
      this.poModal.close();
    },
    label: 'Pesquisar'
  };

  public readonly filtroconfig: PoPageFilter = {
    action: 'filterAction',
    ngModel: 'filtro',
    placeholder: 'Buscar',
    advancedAction: this.busca.bind(this)
  };

  @ViewChild('optionsForm', { static: true }) form: NgForm;
  @ViewChild('modalForm', { static: true }) formModal: NgForm;
  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent;
  @ViewChild('popupmodal', { static: true }) popup: PoPopupComponent;
  @ViewChild('tabela', { static: true }) tabela: PoTableComponent;

  constructor(private multas: MultasService, private router: Router ) { }

  ngOnInit() {
    const dtinicio = new Date();
    const dtfinal = new Date();
    this.dataAte = dtfinal.toISOString().substring(0, 10);

    const dtaux = this.dataAte.split('-');

    dtinicio.setFullYear(Number(dtaux[0]) - 1);
    this.dataDe = dtinicio.toISOString().substring(0, 10);

    this.userid = sessionStorage.getItem('userid');
    this.porta = sessionStorage.getItem('port');
    this.getColumns();
  }

  getColumns(): void{
    var colunas;
    //var colmultas: Array<PoTableColumn>;
    var array = {};
    var linha = '[';
    this.multas.execPost1(this.consulta, this.dataDe, this.dataAte).subscribe(response => {
      colunas = response.schemaSql.columns;
      colunas.forEach(n => {
        linha += '{"property": "'+n.columnName+'", "label": "'+n.columnName+'", "type": "'+n.columnType.toLocaleLowerCase()+'"},';
      });
      linha += '{"property": "TESTE", "label":"teste", "type": "string"}';
      linha += ']'

      this.colmultas = JSON.parse(linha);
      this.atualizarlista();
    });
  }

  atualizarlista(): void {
    this.carregando = true;
    this.multas.execPost(this.consulta, this.dataDe, this.dataAte).subscribe(response => {
      this.dadosmultas = JSON.parse(response.data);
      this.dadosaux    = JSON.parse(response.data);
      this.carregando = false;
      this.popup.open();
    });
  }

  filterAction(filter = [this.filtro]) {
    this.filtroaux = filter.map(value => ({ value }));
    this.filtrar();
  }

  filtrar() {
    const filters = this.filtroaux.map(filtro => filtro.value);
    if (this.filtro.length > 0) {
      this.dadosmultas = this.dadosaux.filter(item => {
        return Object.keys(item)
        .some(key => (!(item[key] instanceof Object) && this.incluifiltro(item[key], filters)));
      });
    } else {
      this.dadosmultas = this.dadosaux;
    }
  }

  incluifiltro(item, filters) {
    return filters.some(filter => String(item).toLocaleLowerCase().includes(filter.toLocaleLowerCase()));
  }

  consultar() {
    this.multas.qrymultas = this.consulta;
    this.getColumns();
    //this.poModal.open();
  }

  incluir() {
    this.router.navigate(['/multas', '']);
  }

  exportarTabela(tipo = 'csv') {
    let dialog;
    let jsonColunas = '';
    let qweb;
    this.col_e_items = {
      colunas: this.colmultas,
      items: this.dadosmultas
    };
    this.jsonColunas = JSON.stringify(this.col_e_items);
    jsonColunas = this.jsonColunas;
    // Conecta WebSocket e prepara mensageria global
    const baseUrl = 'ws://127.0.0.1:' + this.porta;
    const socket = new WebSocket(baseUrl);
    this.carregando = true;
    socket.onclose = () => { console.error('WebChannel closed'); };
    socket.onerror = (error) => { console.error('WebChannel error: ' + error); };

    socket.onopen = () => {
      qweb = new QWebChannel(socket, (channel) => {
        // Torna "dialog" acessivel globalmente
        dialog = channel.objects.mainDialog;

        // Envia ao ADVPL informando sucesso na criacao do formulario
        dialog.jsToAdvpl(tipo, jsonColunas);
      });
    };

    this.carregando = false;
  }

  busca() {
    this.poModal.open();
  }
}




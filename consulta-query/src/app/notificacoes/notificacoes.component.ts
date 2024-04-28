import { Component, OnInit, ViewChild } from '@angular/core';
import { PoTableColumn, PoCheckboxGroupOption, PoPageFilter, PoPageAction, PoModalAction, PoModalComponent } from '@po-ui/ng-components';
import { NotificacoesService } from './notificacoes.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { QWebChannel } from '@totvs/twebchannel-js';

@Component({
  selector: 'app-notificacoes',
  templateUrl: './notificacoes.component.html',
  styleUrls: ['./notificacoes.component.css']
})
export class NotificacoesComponent implements OnInit {

  colnotificacoes: Array<PoTableColumn>;
  dadosnotificacoes: Array<object>;
  dadosaux: Array<object>;
  statusOptions: Array<PoCheckboxGroupOption>;
  carregando: boolean = true;
  filtro: string = '';
  jsonColunas = '';
  porta = '';
  userid = '';
  dataDe;
  dataAte;
  colEItems;
  filtroaux = [];

  pageactions: Array<PoPageAction> = [
    {label: 'Incluir'  , action: this.incluir.bind(this)},
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
      console.log(this.dataDe);
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

  constructor(private notificacoes: NotificacoesService, private router: Router ) { }

  ngOnInit() {
    const dtinicio = new Date();
    const dtfinal = new Date();
    this.dataAte = dtfinal.toISOString().substring(0, 10);

    const dtaux = this.dataAte.split('-');

    dtinicio.setFullYear(Number(dtaux[0]) - 1);
    this.dataDe = dtinicio.toISOString().substring(0, 10);

    this.userid = sessionStorage.getItem('userid');
    this.porta = sessionStorage.getItem('port');

    this.atualizarlista();
    this.colnotificacoes = this.notificacoes.getColumns();
  }

  atualizarlista(): void {
    this.notificacoes.execPost(this.dataDe, this.dataAte).subscribe(response => {
      this.dadosnotificacoes = JSON.parse(response.data);
      this.dadosaux    = JSON.parse(response.data);
      this.carregando = false;
    });
  }

  filterAction(filter = [this.filtro]) {    
    this.filtroaux = filter.map(value => ({ value }));
    this.filtrar();
  }

  filtrar() {
    const filters = this.filtroaux.map(filtro => filtro.value);
    if (this.filtro.length > 0) {
      this.dadosnotificacoes = this.dadosaux.filter(item => {
        return Object.keys(item)
        .some(key => (!(item[key] instanceof Object) && this.incluifiltro(item[key], filters)));
      });

    } else 
      this.dadosnotificacoes = this.dadosaux;
  }

  incluifiltro(item, filters) {
    return filters.some(filter => String(item).toLocaleLowerCase().includes(filter.toLocaleLowerCase()));
  }

  incluir(){    
    this.router.navigate(['/notificacoes','']);
  }

  exportarTabela(tipo = 'csv') {
    let dialog;
    let jsonColunas = '';
    let qweb;
    this.colEItems = {
      colunas: this.colnotificacoes,
      items: this.dadosnotificacoes
    };

    this.jsonColunas = JSON.stringify(this.colEItems);
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

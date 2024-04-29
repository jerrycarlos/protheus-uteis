import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { PoButtonGroupItem, PoDynamicFieldType, PoDynamicFormField, PoModalAction, PoModalComponent, PoNotificationService, PoSearchComponent, PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { BaseComponent } from '../base/base.component';
import { HttpService } from '../services/http.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PoDynamicField } from '@po-ui/ng-components/lib/components/po-dynamic/po-dynamic-field.interface';

@Component({
  selector: 'app-banco-conhecimento',
  templateUrl: './banco-conhecimento.component.html',
  styleUrls: ['./banco-conhecimento.component.css']
})
export class BancoConhecimentoComponent extends BaseComponent implements OnInit{
  
  @ViewChild('modalEntidade', { static: true }) modalEntidade!: PoModalComponent;
  @ViewChild('inputSearch', { static: true }) inputSearch!: PoSearchComponent;

  override carregando = false;
  textAguarde: string = '';
  columns: Array<PoTableColumn> = new Array<PoTableColumn>();
  dadosAC9: any;
  columnsItens: Array<PoTableColumn> = new Array<PoTableColumn>();
  fieldsEntidade : Array<PoDynamicFormField> = new Array<PoDynamicFormField>();
  dadosEntidade : any = {};
  arrayDadosEntidade = new Array();
  //arquivoexiste = false;

  entidades: Array<any> = [{entidade:'SB1', descricao:'Produtos'},{entidade:'SC7', descricao:'Pedido de Compra'},{entidade:'SF1', descricao:'Documento de Entrada'},{entidade:'SF2', descricao:'Documento de Saída'}];
  filterKeys: Array<string> = ['entidade', 'descricao'];
  entidadeFiltrada: Array<any> = [];

  buttons: Array<PoButtonGroupItem> = [
    /*{ tooltip: 'Auto-Relacionar', action: this.showConsole.bind(this), icon: 'po-icon po-icon-link' },
    { tooltip: 'Escolher Layout', action: this.showConsole.bind(this), icon: 'po-icon po-icon-device-desktop' },
    { tooltip: 'Visualizar Contrato', action: this.showConsole.bind(this), icon: 'po-icon po-icon-eye' },
    { tooltip: 'Visualizar XML', action: this.showConsole.bind(this), icon: 'po-icon po-icon-xml' },*/
    { tooltip: 'Confirmar', action: this.confirmar.bind(this), icon: 'po-icon po-icon-ok' }
  ];

  actions: Array<PoTableAction> = [
    {
      action: this.abreRegistro.bind(this),
      icon: 'po-icon po-icon-search',
      label: 'Ver Registro'
    }
  ];

  actionsItem: Array<PoTableAction> = [
    {
      action: this.downloadFile.bind(this),
      icon: 'po-icon po-icon-download',
      label: '',
      disabled: this.arquivoexiste(this),
    }
  ];

  fecharRegistro: PoModalAction = {
    action: () => {
      this.modalEntidade.close();
    },
    label: 'Fechar'
  };

  private poNotification: PoNotificationService;
  
  entidade = '';
  
  constructor(
    public override httpService: HttpService,
    private router: Router,
    private route: ActivatedRoute,
    protected injector: Injector) {
      super(httpService, '/banco-conhecimento/', '');
      this.poNotification = this.injector.get(PoNotificationService);

  }

  override ngOnInit(): void {
    
    const urlParams = new URLSearchParams(window.location.search);
    const porta = urlParams.get('porta');
    const chavenfe = urlParams.get('chavenfe');
    const contrato = urlParams.get('contrato');
    const revisa = urlParams.get('revisa');
    const planilha = urlParams.get('planilha');
    const competencia = urlParams.get('competencia');

    this.columns = this.getColumnsAC9();
    this.dadosAC9 = this.getColumnsAC9();
    this.columnsItens = this.getColumnsItens();
    this.getEntidades();
    //this.getDadosAC9();
  }
  
  arquivoexiste(item: any){
    console.log(item.ACB_OBJETO);
    if ( 'Arquivo não existe'.indexOf(item.ACB_OBJETO))
        return true;
    else
      return false;
  }

  showConsole(){
    console.log("teste");
  }

  filtered(event: Array<any>) {
    this.entidadeFiltrada = event;
    if (event.length == 0 || this.inputSearch.poSearchInput.nativeElement.value.length == 0) {
      this.entidadeFiltrada = [];
    } else {
      try {
      } catch (error) {
        return undefined;
      }
    }
  }

  confirmar(){
    if (this.entidadeFiltrada.length == 0){
      this.poNotification.warning("Digite uma tabela válida para realizar a busca.");
      console.log(this.poNotification);
      return;
    }else if (this.entidadeFiltrada.length > 1){
      this.poNotification.warning("Busque apenas 1 tabela.");
      console.log(this.poNotification);
      return;
    }
    console.log(this.entidadeFiltrada);
    this.entidade = this.entidadeFiltrada[0].entidade;
    this.getDadosAC9();
  }

  async getDadosAC9(){
    let url = this.endpoint + 'consulta/' + this.entidade;
    console.log(url);
    //this.setDadosNota();
    this.carregando = true;
    this.httpService.get(url).subscribe(
      resource => {
        this.dadosAC9 = resource.data;
      },
      error => {
        console.log(error);
        this.carregando = false;
      },
      () => {
        this.carregando = false;
      }
    );

    this.carregando = false;
  }

  async abreRegistro(item:any){
    let fields = await this.getFieldsEntidade(this.entidade, item.AC9_FILIAL + item.AC9_CODENT);
    if (fields.code == '200'){
      for(const d of this.arrayDadosEntidade){
        this.dadosEntidade[d.campo] = d.valor;
      }
      this.modalEntidade.open();
    }else{
      this.poNotification.warning(fields.data);
    }
    this.carregando = false;
  }

  async getEntidades(){
    const entidades = await this.httpService.get(this.endpoint + 'consulta/entidades').toPromise() as any;
    this.entidades = entidades.data;
  }

  async getFieldsEntidade(alias : string, chave : string){
    let formFields = Array<PoDynamicFormField>();
    let fieldAux : PoDynamicFormField;
    this.carregando = true;
    const fields = await this.httpService.get(this.endpoint + 'consulta/dados/' + this.entidade + '/' + chave).toPromise() as any;
    console.log(fields);
    for(const d of fields.data){
      fieldAux = {
        property: d.campo,
        label: d.descricao,
        type: d.tipo,
        gridColumns: d.tipo == 'date' ? 4 : d.tamanho > 59 ? 12 : d.tamanho > 50 ? 6 : d.tamanho > 15 ? 5 : 3,
        rows: d.tamanho > 50 ? 5 : 1,
        disabled: true
      };
      console.log(d);
      this.arrayDadosEntidade.push({'campo':d.campo, 'valor':d.valor, 'tipo':d.tipo, 'tamanho':d.tamanho, 'decimal':d.decimal});
      //this.dadosEntidade[d.campo] = d.tipo == 'number' ? d.valor.toString() : d.valor;
      formFields.push(fieldAux);

    }
    this.fieldsEntidade = formFields;
    console.log(formFields);
    return fields;
  }

  downloadFile(item:any) {
    let url = this.endpoint + 'base64/download/' + item.ACB_CODOBJ
    this.httpService.get(url).subscribe((data: any) => {
      const base64Data = data.result.base64;
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style.display = 'none';
      a.href = url;
      a.download = data.result.nomearquivo; // Defina o nome do arquivo aqui
      a.click();

      window.URL.revokeObjectURL(url);
    });
  }

  getColumnsAC9(): Array<PoTableColumn> {
    return [
      { property: 'AC9_FILIAL', label: 'Filial', type: 'string', width: '20%'},
      { property: 'AC9_CODENT', label: 'Cod. Entidade', type: 'string', width: '35%'}
    ];
  }

  getColumnsItens(): Array<PoTableColumn> {
    return [
      {
        property: 'extensao',
        label: 'Extensão',
        type: 'subtitle',
        width: '10%',
        subtitles: [
          { value: 'jpg', color: 'color-02', label: 'JPG', content: 'JPG' },
          { value: 'jpeg', color: 'color-02', label: 'JPEG', content: 'JPEG' },
          { value: 'bmp', color: 'color-02', label: 'BMP', content: 'BMP' },
          { value: 'png', color: 'color-02', label: 'PNG', content: 'PNG' },
          { value: 'csv', color: 'color-11', label: 'CSV', content: 'CSV' },
          { value: 'xls', color: 'color-11', label: 'XLS', content: 'XLS' },
          { value: 'xml', color: 'color-11', label: 'XML', content: 'XML' },
          { value: 'log', color: 'color-08', label: 'LOG', content: 'LOG' },
          { value: 'txt', color: 'color-08', label: 'TXT', content: 'TXT' },
          { value: 'pdf', color: 'color-07', label: 'PDF', content: 'PDF' }
        ]
      },
      { property: 'ACB_CODOBJ', label: 'Cod. Objeto', type: 'string', width: '15%'},
      { property: 'ACB_OBJETO', label: 'Objeto', type: 'string', width: '20%' },
      { property: 'ACB_DESCRI', label: 'Descrição', type: 'string', width: '35%'  }
    ];
  }
}
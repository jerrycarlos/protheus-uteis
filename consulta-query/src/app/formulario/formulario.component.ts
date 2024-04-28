import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PoDynamicFormField, PoNotificationService, PoDynamicFormFieldChanged, PoDynamicFormValidation, PoDynamicFormComponent } from '@po-ui/ng-components';
import { FormserviceService } from './formservice.service';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {

  recno: string;
  campos: Array<PoDynamicFormField>;
  dados: any = {};
  ativo: boolean;
  inclusao: boolean;
  tipoform: string;
  titulo: string;
  userid = '';
  porta = '';

  @ViewChild('dynamicForm', { static: true }) dynamicForm: PoDynamicFormComponent;

  constructor(public poNotification: PoNotificationService, private route: ActivatedRoute, private router: Router, private formulario: FormserviceService  ){ }

  ngOnInit() {

    this.userid = sessionStorage.getItem('userid');
    this.porta = sessionStorage.getItem('port');

    this.getDados();
    this.setFormFields();
    console.log(this.campos);
  }

  private getDados(){
    
    this.tipoform = this.router.url.search('multa') == 1 ? 'Multa' : 'Notificação' ;

    this.route.paramMap.subscribe(parameters => {      
      this.recno = parameters.get('id')
    });

    this.inclusao = this.recno == '';

    if (this.inclusao) {
      this.titulo = 'Inclusão de ' 
    } else {
      this.titulo = 'Consulta de ' ;
    };

    this.titulo += this.tipoform;

    if (this.recno != '') {
      this.formulario.execPost(this.recno).subscribe(response => {            
        this.dados = JSON.parse(response.data)[0];          
        this.dados['Z69_SITUA'] = this.dados['Z69_SITUA'].trim();
        console.log(this.dados['Z69_SITUA'].trim());
      }); 
    } 
  }

  setFormFields(){
    this.campos = [
      { 
        property: 'Z69_PLACA' , label: 'Placa'        , mask: 'AAA-AAAA', type: 'string', divider: 'Dados Veículo',  gridLgColumns: 6, errorMessage: 'Preenhca a placa', required: true},
      { property: 'Z69_RENAVA', label: 'Renavam'      , type: 'string', gridLgColumns: 6  },
      { property: 'Z69_PROPRI', label: 'Proprietário' , type: 'string', gridColumns: 6, gridLgColumns: 12, gridMdColumns: 12, gridSmColumns: 12, gridXlColumns: 6 },
      { property: 'Z69_SITUA' , label: 'Situação'     , type: 'string', gridColumns: 2, divider: 'Dados da Infração', options: ['Pago', 'Em aberto', 'Efeito suspensivo',''],required: true},      
      { property: 'Z69_DATA'  , label: 'Data'         , type: 'date'  , gridColumns: 2, required: true },  
      { property: 'Z69_HORA'  , label: 'Hora'         , maxLength: 5, minLength: 5, type: 'string', gridColumns: 2, optional: true },  
      { property: 'Z69_LOCAL' , label: 'Local'        , type: 'string', gridColumns: 2, required: true },
      { property: 'Z69_COMPLE', label: 'Complemento'  , type: 'string', gridColumns: 4, required: true },
      { property: 'Z69_DESCRI', label: 'Infração'     , type: 'string', gridColumns: 6, required: true },      
      { property: 'Z69_AUTO'  , label: 'Num.Auto'     , type: 'string', gridColumns: 6, required: false},      
      { property: 'Z69_GUIA'  , label: 'Guia'         , type: 'string', optional: true },
      { property: 'Z69_VENCTO', label: 'Vencimento'   , type: 'date'  , required: false, optional: true},
      { property: 'Z69_VLRNOM', label: 'Valor Nominal', type: 'currency', required: true },
      { property: 'Z69_VLRATU', label: 'Valor Atual'  , type: 'currency', required: true },      
      { property: 'MOTORISTA' , label: 'Motorista'    , type: 'string', required: true, gridColumns: 12   },      
    ]
  }

  voltar(){
    this.router.navigate(['/multas']);
  }
  
  salvar(){
    this.dados['Z69_TIPO'] = this.tipoform.substring(0,1);    
    this.dados['Z69_USRINC'] = this.userid;
    console.log(this.dados);   
    this.formulario.postNovoDado(JSON.stringify(this.dados)).subscribe(response => {            
      console.log(response);      
      this.poNotification.success('Inclusão realizada com sucesso.'); 
      this.router.navigate([this.router.url]);      
    });   
  }

  onChangeFields(changedValue): PoDynamicFormValidation {

    if (changedValue.property === 'Z69_PLACA') {
      return {
        value: { },
        fields: [ ]
      };
    }

  }

}

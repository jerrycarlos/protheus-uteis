import { OnInit, Injectable, Inject } from '@angular/core';
import { HttpService } from '../services/http.service';
import { PoPageFilter, PoTableColumn } from '@po-ui/ng-components';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export abstract class BaseComponent implements OnInit {

  constructor(
    public httpService: HttpService,
    @Inject(String) public endpoint : string,
    @Inject(String) public filtros: string,

  ) { }

  carregando = true;
  resources: any;
  resourcesAux: any;
  dadosAux: any;
  filter = [];
  sessao: any;

  ngOnInit() {}

  get() {

    this.carregando = true;

    this.httpService.get(this.endpoint ).subscribe(
      data => {
        this.resources = data.items;
        console.log(data)
        if (data.titulo !== undefined) {
          
        }
      },
      error => {
        this.resources = [];
        this.carregando = false;
      },
      () => {
        this.carregando = false;
      }
    );

  }

  getaux(path: string): Observable<any> {
    return this.httpService.get(this.endpoint + this.sessao.tecnico + '/' + path + '?' + this.filtros);
  }
}

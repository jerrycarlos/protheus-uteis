import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PoModule, PoLoadingModule } from '@po-ui/ng-components';
import { RouterModule } from '@angular/router';
import { MultasComponent } from './multas/multas.component';
import { PainelComponent } from './painel/painel.component';
import { ChartsModule } from 'ng2-charts';
import { NgxCompactNumberModule } from 'ngx-compact-number';
import { NotificacoesComponent } from './notificacoes/notificacoes.component';
import { FormularioComponent } from './formulario/formulario.component';
import { FormsModule } from '@angular/forms';
import { PoPageDynamicTableModule, PoPageDynamicSearchModule } from '@po-ui/ng-templates';

@NgModule({
  declarations: [
    AppComponent,
    MultasComponent,
    PainelComponent,
    NotificacoesComponent,
    FormularioComponent,
  ],
  imports: [
    NgxCompactNumberModule,
    ChartsModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    PoPageDynamicTableModule,
    PoPageDynamicSearchModule,
    PoModule,
    PoLoadingModule,
    RouterModule.forRoot([], { relativeLinkResolution: 'legacy' })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

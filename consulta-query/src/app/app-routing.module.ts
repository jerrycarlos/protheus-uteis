import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MultasComponent } from './multas/multas.component';
import { PainelComponent } from './painel/painel.component';
import { NotificacoesComponent } from './notificacoes/notificacoes.component';
import { FormularioComponent } from './formulario/formulario.component';

const routes: Routes = [
  {path: '', component: PainelComponent },
  {path: 'index.html', component: PainelComponent },
  {path: 'multas', component: MultasComponent},  
  {path: 'notificacoes', component: NotificacoesComponent},
  {path: 'notificacoes/:id', component: FormularioComponent},
  {path: 'multas/:id', component: FormularioComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})

export class AppRoutingModule { }

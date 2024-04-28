import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { PoPageDynamicTableComponent } from '@po-ui/ng-templates';
import { BancoConhecimentoComponent } from './banco-conhecimento/banco-conhecimento.component';

const routes: Routes = [
  {path: '', component: BancoConhecimentoComponent },
  {path: 'index.html', component: BancoConhecimentoComponent },
  {path: 'banco', component: BancoConhecimentoComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

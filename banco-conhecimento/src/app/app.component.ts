import { Component } from '@angular/core';

import { PoMenuItem } from '@po-ui/ng-components';
import { PoPageDynamicTableModule } from '@po-ui/ng-templates';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  readonly menus: Array<PoMenuItem> = [
    { label: 'Banco', link: '/' }
  ];

}

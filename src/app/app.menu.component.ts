import {Component, OnInit} from '@angular/core';
import {AppMainComponent} from './app.main.component';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {

    model: any[];

    constructor(public appMain: AppMainComponent) {}

    ngOnInit() {
        this.model = [
          // {
          //     label: 'Favorites', icon: 'pi pi-home',
          //     items: [
          //         {label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/']}
          //     ]
          // },
          // {separator: true},
          {
            label: "Utilities",
            icon: "pi pi-fw pi-star",
            routerLink: ["/"],
            items: [
              {
                label: "CheckList",
                icon: "pi pi-fw pi-directions",
                routerLink: ["/"],
              },
            ],
          },
        ];
    }
}

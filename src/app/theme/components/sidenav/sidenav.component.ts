import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnInit, Output,
  TemplateRef
} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs";
import {map} from "rxjs/operators";

export interface SideMenu {
  title: string;
  icon: string;
  url: string;
  expanded?: boolean;
  header?: boolean;
  children?: SideMenu[]; 
  active?: boolean;
}

@Component({
  selector: 'uni-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent{

  @ContentChild('appTitle') appTitle!: TemplateRef<any>;
  @Output() active = new EventEmitter<SideMenu>;
  @Input() isOverlap = false;

  @Input() menus: SideMenu[] = [
    {
      title: 'Dashboard',
      url: '/pages/dashboard',
      icon: 'pi pi-home',
    },
    // {
    //   title: 'Components',
    //   url: '',
    //   icon: 'pi pi-chart-bar',
    //   children: [
    //     {
    //       title: 'Button',
    //       url: '/pages/button',
    //       icon: ''
    //     },
    //     {
    //       title: 'Cards',
    //       url: '/pages/cards',
    //       icon: ''
    //     },
    //     {
    //       title: 'Popup',
    //       url: '/pages/popups',
    //       icon: ''
    //     }
    //   ]
    // },
    {
      title: 'Pre Application',
      url: '',
      icon: 'pi pi-search',
    },
    {
      title: 'Post Application',
      url: '',
      icon: 'pi pi-file-pdf',
    },
    {
      title: 'Post Admission',
      url: '',
      icon: 'pi pi-file-pdf',
    },
    {
      title: 'Career Hub',
      url: '',
      icon: 'pi pi-search',
    },
    {
      title: 'University',
      url: '',
      icon: 'pi pi-search',
    },
    {
      title: 'Life at UK',
      url: '',
      icon: 'pi pi-search',
    },
    {
      title: 'Subscription',
      url: '/pages/subscriptions',
      icon: 'pi pi-search',
    },
    {
      title: 'FAQ',
      url: '/pages/faq',
      icon: 'pi pi-comments',
    },
    {
      title: 'Help & Support',
      url: '/pages/help',
      icon: 'pi pi-briefcase',
    }
    //,
    // {
    //   title: 'USER MANAGER',
    //   url: '/pages/usermanagement',
    //   icon: 'pi pi-briefcase',
    // },
    // {
    //   title: 'SUBCRIPTION MANAGER',
    //   url: '/pages/subscriptionmanagement',
    //   icon: 'pi pi-briefcase',
    // }
  ];

  constructor(
      private router: Router,
      private activatedRoute: ActivatedRoute
  ) {
    router.events
        .pipe(
            filter((event) => event instanceof NavigationEnd),
            map(() => activatedRoute),
            map((route) => {
              while (route.firstChild) {
                route = route.firstChild;
              }
              return route;
            })
        )
        .subscribe({
          next: () => {
            this.markCurrentMenu();
          }
        });
  }

  ngOnInit(): void {
    this.markCurrentMenu();
  }

  markCurrentMenu() {
    const path = this.router.url.split('?')[0];
    const paramtersLen = Object.keys(this.activatedRoute.snapshot.params).length;
    const pathArr = path.split('/').slice(0, path.split('/').length - paramtersLen);
    const url = pathArr.join('/');
    this.menus.forEach(menu => {
      if (url.includes(menu.url || '**') && menu.url != '/') {
        menu.active = true;
        this.active.emit(menu);
      } else if (menu.url == url) {
        menu.active = true;
        this.active.emit(menu);
      } else {
        if (menu.children && menu.children?.length > 0) {
          menu.children.forEach(cmenu => {
            if (url.includes(cmenu.url || '**')) {
              cmenu.active = true;
              menu.active = true;
              this.active.emit(cmenu);
            } else {
              cmenu.active = false;
              menu.active = false;
            }
          });
        } else {
          menu.active = false;
        }
      }
    });
  }

  onexpand(item: SideMenu) {
    if (item.header) {
      return;
    }
    if (item.expanded) {
      item.expanded = !item.expanded;
      return;
    }
    if (item.children) {
      if (item.children.length > 0) {
        item.expanded = true;
      } else {
        item.expanded = false;
      }
    } else {
      this.router.navigateByUrl(item.url || '/');
    }
  }

}

import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnInit, Output,
  TemplateRef
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs";
import { map } from "rxjs/operators";
import { DataService } from 'src/app/data.service';

export interface SideMenu {
  title: string;
  image: string;
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
export class SidenavComponent {
  @ContentChild('appTitle') appTitle!: TemplateRef<any>;
  @Output() active = new EventEmitter<SideMenu>;
  @Input() isOverlap = false;

  @Input() menus: SideMenu[] = [
    {
      title: 'Dashboard',
      url: '/pages/dashboard',
      image: 'fa-solid fa-house',
    },
    // {
    //   title: 'Components',
    //   url: '',
    //   image: 'pi pi-chart-bar',
    //   children: [
    //     {
    //       title: 'Button',
    //       url: '/pages/button',
    //       image: ''
    //     },
    //     {
    //       title: 'Cards',
    //       url: '/pages/cards',
    //       image: ''
    //     },
    //     {
    //       title: 'Popup',
    //       url: '/pages/popups',
    //       image: ''
    //     }
    //   ]
    // },
    {
      title: 'Pre Application',
      url: '/pages/pre-application',
      image: 'fa-solid fa-file-import',
    },
    {
      title: 'Post Application',
      url: '/pages/post-application',
      image: 'fa-solid fa-file-export',
    },
    {
      title: 'Post Admission',
      url: '/pages/post-admission',
      image: 'fa-solid fa-ticket',
    },
    {
      title: 'Career Hub',
      url: '/pages/career-hub',
      image: 'fa-solid fa-briefcase',
    },
    {
      title: 'University',
      url: '',
      image: 'fa-solid fa-building-columns',
    },
    {
      title: 'Life at',
      url: '',
      image: 'fa-solid fa-earth-americas',
    },
    {
      title: 'Subscription',
      url: '/pages/subscriptions',
      image: 'fa-solid fa-crown',
    },
    {
      title: 'FAQ',
      url: '/pages/faq',
      image: 'fa-solid fa-comments-question',
    },
    {
      title: 'Help & Support',
      url: '/pages/help',
      image: 'fa-solid fa-phone-volume',
    }
    //,
    // {
    //   title: 'USER MANAGER',
    //   url: '/pages/usermanagement',
    //   image: 'pi pi-briefcase',
    // },
    // {
    //   title: 'SUBCRIPTION MANAGER',
    //   url: '/pages/subscriptionmanagement',
    //   image: 'pi pi-briefcase',
    // }
  ];
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService
  ) {
    this.dataService.countryNameSource.subscribe(countryName => {
      this.menus.filter(data => {
        if(data.title.includes('Life at'))
        data.title = 'Life at '+countryName;
      });
    });
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

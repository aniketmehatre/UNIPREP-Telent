import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  TemplateRef
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs";
import { map } from "rxjs/operators";
import { AuthService } from 'src/app/Auth/auth.service';
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
    {
      title: 'Subscription',
      url: '/pages/subscriptions',
      image: 'fa-solid fa-crown',
    },
    {
      title: 'Study',
      url: '',
      image: '',
    },
    {
      title: 'Pre Application',
      url: '/pages/modules/pre-application',
      image: 'fa-solid fa-file-import',
    },
    {
      title: 'Post Application',
      url: '/pages/modules/post-application',
      image: 'fa-solid fa-file-export',
    },
    {
      title: 'Post Admission',
      url: '/pages/modules/post-admission',
      image: 'fa-solid fa-ticket',
    },
    {
      title: 'University',
      url: '/pages/modules/university',
      image: 'fa-solid fa-building-columns',
    },
    {
      title: 'Career',
      url: '',
      image: '',
    },
    {
      title: 'Career Hub',
      url: '/pages/modules/career-hub',
      image: 'fa-solid fa-briefcase',
    },
    {
      title: 'Life',
      url: '',
      image: '',
    },
    {
      title: 'Life at',
      url: '/pages/modules/life-at-country',
      image: 'fa-solid fa-earth-americas',
    },
    {
      title: 'Explore',
      url: '',
      image: '',
    },
    {
      title: 'Events',
      url: '/pages/events',
      image: 'fa-solid fa-calendar-days',
    },
    {
      title: 'Resources',
      url: '/pages/resource',
      image: 'fa-solid fa-link',
    },
    {
      title: 'Support',
      url: '',
      image: '',
    },
    {
      title: 'Tutorials',
      url: '/pages/tutorials',
      image: 'fa-solid fa-video',
    },
    {
      title: 'FAQ',
      url: '/pages/faq',
      image: 'fa-solid fa-comments-question',
    },
    // {
    //   title: 'Help & Support',
    //   url: '/pages/help',
    //   image: 'fa-solid fa-phone-volume',
    // }
    // ,
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
  conditionSubscribed!: boolean;
  currentTitle: any;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private authService: AuthService
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
    this.authService.getNewUserTimeLeft().subscribe(res => {
      let data = res.time_left;
      if (data.plan === 'expired' || data.plan === 'subscription_expired' ) {
        this.conditionSubscribed = false;
      }
      else {
        this.conditionSubscribed = true;
      }
    });
    //this.changeSubscriptionUrl();
  }

  changeSubscriptionUrl() {
    if(this.authService.user?.subscription) {
      const subscriptionItem = this.menus.find(item => item.title === 'Subscription');
      if (subscriptionItem) {
        subscriptionItem.url = 'subscriptions/subscription-history';
      }
    }
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

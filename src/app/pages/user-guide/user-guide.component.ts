import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'uni-user-guide',
  templateUrl: './user-guide.component.html',
  styleUrls: ['./user-guide.component.scss']
})
export class UserGuideComponent implements OnInit {
  pdf:string='https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
  constructor() { }

  guideList = [
    { id: 1, title: 'Automatic renewal' }, { id: 2, title: 'Subscription invoices' },
    { id: 3, title: 'Rejected and declined payments' }, { id: 4, title: 'SOP checker Premium Plans' },
    { id: 5, title: 'Payments methods' }, { id: 6, title: 'Change payment method' },
    { id: 7, title: 'Automatic renewal cancellation' }, { id: 8, title: 'Subscription upgrade' },
    { id: 9, title: 'Benefits of being Premium' }]

  ngOnInit(): void {
     
  }

  changePdf(item: any) {
    console.log(item);

    let itemId = item.id;
    switch (itemId) {
      case 1: {
        this.pdf=''
        break;
      }
      case 2: {
        this.pdf=''
        break;
      }
      case 3: {
        this.pdf=''
        break;
      }
      case 4: {
        this.pdf=''
        break;
      }
      case 5: {
        this.pdf=''
        break;
      }
      case 6: {
        this.pdf=''
        break;
      }
      case 7: {
        this.pdf=''
        break;
      }
      case 8: {
        this.pdf=''
        break;
      }
      default: {
        this.pdf=''
        break;
      }
    }

  }

}

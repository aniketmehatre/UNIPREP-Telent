import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { MenuItem } from "primeng/api";
import { CountdownComponent, CountdownConfig } from 'ngx-countdown';

@Component({
  selector: "uni-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit {
  @ViewChild('cd', { static: false }) private countdown!: CountdownComponent;
  config: CountdownConfig = {};
  ngOnInit(): void {
    // this.config = {leftTime: 10000, format: "HH:mm:ss"};
    // if(this.countdown){
    //   this.countdown.begin();
    // }

    this.config = {
      leftTime: 300,
      format: 'HH:mm:ss',
      prettyText: (text) => {
        return text
          .split(':')
          .map((v) => `<span class="item">${v}</span>`)
          .join('');
      },
    };
  }
  handleEvent(event: any){

  }

  @Input() breadcrumb: MenuItem[] = [
    { label: "Categories" },
    { label: "Sports" },
  ];
  @Input() expandicon = "";
  @Output() togleSidebar = new EventEmitter();

  onfinish(){

  }

  numericOnly(event: any): boolean {
    let pattern = /^([0-9])$/;
    let result = pattern.test(event.key);
    return result;
  }
}

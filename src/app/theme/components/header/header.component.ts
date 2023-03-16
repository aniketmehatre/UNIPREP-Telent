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
import { CountdownComponent } from 'ngx-countdown';

@Component({
  selector: "uni-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit {
  @ViewChild('cd', { static: false }) private countdown!: CountdownComponent;
  config: any;
  ngOnInit(): void {
    this.config = {leftTime: 10000, format: "HH:mm"};
    if(this.countdown){
      this.countdown.begin();
    }
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
}

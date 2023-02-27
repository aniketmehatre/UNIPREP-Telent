import {Component, HostListener, OnDestroy, OnInit} from "@angular/core";
import {SopService} from "./sop.service";
import {SubSink} from "subsink";
import {Observable} from "rxjs";
import {ConfirmationService} from "primeng/api";

@Component({
  selector: "app-sop",
  templateUrl: "./sop.component.html",
  styleUrls: ["./sop.component.scss"],
})
export class SopComponent implements OnInit, OnDestroy {

  docId!: number;
  stage: number = -1;
  document: string = '';
  private subs = new SubSink();
  constructor(
      private _sopService: SopService,
      public confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.subs.sink = this._sopService.getDocId$().subscribe(id => this.docId = id || 0);
    this.subs.sink = this._sopService.getStage$().subscribe(num => this.stage = num || 1);
    this.subs.sink = this._sopService.getDocument$().subscribe(doc => this.document = doc);
  }

  ngOnDestroy() {
    this.stage = 1;
    this.document = '';
    this.subs.unsubscribe();
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.stage < 2) {
      return true;
    }
    return false;
  }
}

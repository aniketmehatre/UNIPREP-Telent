import {Component, OnDestroy, OnInit} from "@angular/core";
import { Router } from "@angular/router";
import { SopService } from "../sop.service";
import {Observable} from "rxjs";
import {SopDocUploadResponse} from "../../../@Models/sop-response.model";
import {SubSink} from "subsink";
@Component({
  selector: "uni-upload",
  templateUrl: "./upload.component.html",
  styleUrls: ["./upload.component.scss"],
})
export class UploadComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  document: string = '';
  docId: number = 0;
  constructor(
      private router: Router, private _sopService: SopService
  ) {}

  onFileChange(event: any) {
    this.uploadDocument(event.target.files[0]);
  }

  uploadDocument(file: any) {
    let val = {
      document: file,
    };
    this._sopService.uploadDoc(val);
  }


  ngOnInit() {
    this.subs.sink = this._sopService.getDocument$().subscribe(data => this.document = data);
    this.subs.sink = this._sopService.getDocId$().subscribe(data => this.docId = data || 0);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  get characters() {
    return this.document.trim().length;
  }
  get sentences() {
    const lines = this.document.split(/[.!?]/);
    const isLastLineValid = lines.length ? (lines[lines.length - 1].trim().length ? 0 : 1) : 0;
    return isLastLineValid ? lines.length - 1 : lines.length;
  }
  get words() {
    return  this.document.split(' ').length;
  }

  continue() {
    this._sopService.updateDoc(this.document, this.docId);
  }
}

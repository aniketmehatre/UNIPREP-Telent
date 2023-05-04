import {Component, OnDestroy, OnInit} from "@angular/core";
import {SopService} from "../sop.service";
import {SubSink} from "subsink";

@Component({
    selector: "uni-verify",
    templateUrl: "./verify.component.html",
    styleUrls: ["./verify.component.scss"],
})
export class VerifyComponent implements OnInit, OnDestroy {

    text = '';
    textHightlights: any[] = [];
    private subs = new SubSink();

    constructor(
        private _sopService: SopService
    ) {
    }

    get characters() {
        return this.text.trim().length;
    }

    get sentences() {
        const lines = this.text.split(/[.!?]/);
        const isLastLineValid = lines.length ? (lines[lines.length - 1].trim().length ? 0 : 1) : 0;
        return isLastLineValid ? lines.length - 1 : lines.length;
    }

    get words() {
        return this.text.split(' ').length;
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    ngOnInit() {
        this.subs.sink = this._sopService.getDocument$().subscribe(tx => this.text = tx || '');
        this.subs.sink = this._sopService.selectVerified$().subscribe(data => {
            console.log(data)
            const positive = data.positive || [];
            const negative = data.negative || [];
            setTimeout(() => {
                const n1 = positive?.filter(p => p.trim().length != 0)?.map((p: string) => {
                    return {word: p.trim(), color: 'green'};
                });
                const n2 = negative?.filter(p => p.trim().length != 0)?.map((n: string) => {
                    return {word: n.trim(), color: 'red'};
                });
                console.log(n1, n2);
                this.textHightlights = [n1, n2].flat().filter(vv => !!vv.word);
            }, 1000);
        });
    }

    recheck() {
        this._sopService.verifyPlag();
    }

    gotoDownload() {
        this._sopService.gotoDownload();
    }
}
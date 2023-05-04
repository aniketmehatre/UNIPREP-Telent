import {Component, OnDestroy, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {SopService} from "../sop.service";
import {ResultAccordionData} from "../../../@shared/components/result-accordion/result-accordion.component";
import {SubSink} from "subsink";

@Component({
    selector: "uni-analysis",
    templateUrl: "./analysis.component.html",
    styleUrls: ["./analysis.component.scss"],
})
export class AnalysisComponent implements OnInit, OnDestroy {

    result: ResultAccordionData[] = [];
    text = '';
    highLightcontent: string[] = [];
    highLightOptions: any[] = [];
    highLightColor: string = '';
    private subs = new SubSink();

    constructor(
        private router: Router, private _sopService: SopService
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
        this.subs.sink = this._sopService.plag$().subscribe(response => {
            if (!response || (!response.plag && !response.grammar)) {
                return;
            }
            const uniqueBody = response?.plag?.details?.filter(detail => detail.unique == 'true').map(data => {
                return {
                    title: 'YOUR TEXT IS UNIQUE',
                    description: data.query,
                    matchLink: [data.display?.url]
                }
            });
            const plagBody = response?.plag?.details?.filter(detail => detail.unique == 'false').map(data => {
                return {
                    title: 'YOUR TEXT IS PLAGIARIZED',
                    description: data.query,
                    matchLink: [data.display.url]
                }
            });
            const gramBody = response?.grammar?.response?.errors?.filter(details => details.type == 'spelling').map(data => {
                return {
                    title: 'GRAMMATICAL ERRORS',
                    description: data?.bad,
                    data: data.better,
                    matchLink: []
                }
            });
            this.result = [
                {
                    title: 'UNIQUE',
                    tooltip: 'Unique displays the percentage of authentic and unique content in your  SOP.',
                    description: 'CONTENT',
                    type: 'success',
                    score: response?.plag?.uniquePercent || 0,
                    body: uniqueBody
                },
                {
                    title: 'PLAGIARIZED',
                    tooltip: 'Plagiarized signifies the percentage of content incorporated into your SOP form web. ',
                    description: 'CONTENT',
                    type: 'danger',
                    score: response?.plag?.plagPercent || 0,
                    body: plagBody
                },
                {
                    title: 'GRAMMATICAL',
                    tooltip: '',
                    description: 'ERRORS',
                    type: 'warning',
                    score: -1,
                    body: gramBody
                }
            ];
        });
        this.subs.sink = this._sopService.uploadedDocdetails$().subscribe((response: string) => {
            this.text = response || '';
            this._sopService.checkPlagFromData(this.text);
        });
    }

    onContentClick(data: { content: string, type: string, data: any[] }) {
        if (data.type == 'PLAGIARIZED') {
            this.highLightColor = '#feadad';
        } else if (data.type == 'GRAMMATICAL') {
            this.highLightColor = 'yellow';
            this.highLightOptions = data.data;
        } else if (data.type == 'UNIQUE') {
            this.highLightColor = '#79f379';
            this.highLightOptions = data.data;
        } else {
            this.highLightColor = 'gray';
        }
        setTimeout(() => {
            this.highLightcontent = [data.content];
        }, 100)
    }

    gotoVerify() {
        this._sopService.verifyPlag();
    }

    recheck() {
        this._sopService.checkPlagFromData(this.text);
    }
}

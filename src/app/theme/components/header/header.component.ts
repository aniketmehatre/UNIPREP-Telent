import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewContainerRef,
    ViewEncapsulation,
} from "@angular/core";
import {MenuItem, MessageService} from "primeng/api";
import {CountdownConfig} from 'ngx-countdown';
import {ModalService} from "src/app/components/modal/modal.service";
import {AuthService} from "../../../Auth/auth.service";
import {SubSink} from "subsink";
import {Router} from "@angular/router";
import {LocationService} from "../../../location.service";

const KEY = 'time'
let DEFAULT = 0

@Component({
    selector: "uni-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit, OnDestroy {
    config: CountdownConfig | null = null;
    @Input() breadcrumb: MenuItem[] = [
        {label: "Categories"},
        {label: "Sports"},
    ];
    @Input() expandicon = "";
    @Output() togleSidebar = new EventEmitter();
    private subs = new SubSink();
    userName: any;
    firstChar: any;
    moduleList: any [] = [];
    reportOptionList: any [] = [];

    constructor(
        private modalService: ModalService, private router: Router, private locationService: LocationService,
        private viewContainerRef: ViewContainerRef,
        private service: AuthService,
        private toast: MessageService
    ) {

    }

    ngOnInit() {
        this.getModuleList();
        this.getReportOption();

        this.subs.sink = this.service.selectLogInData$().subscribe(data => {
            if (data) {
                localStorage.setItem('question_left', data.questions_left);
                localStorage.setItem(KEY, `${data.time_left * 60}`);
            }
        });

        if (localStorage.getItem(KEY)) {
            this.config = {
                leftTime: Number(localStorage.getItem(KEY)),
                format: 'HH:mm:ss',
                notify: 0,
                prettyText: (text) => {
                    return text
                        .split(':')
                        .map((v) => `<span class="item">${v}</span>`)
                        .join('');
                },
            };
        }

        this.subs.sink = this.service.getMe().subscribe(data => {
            this.userName = data.userdetails[0].name.toString();
            this.firstChar = this.userName.charAt(0);
        });
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }


    handleEvent(ev: any) {
        if (ev.action === 'notify') {
            localStorage.setItem(KEY, `${ev.left / 1000}`);
        }
    }

    openModal(e: any) {
        e.preventDefault();
        this.modalService.setRootViewContainerRef(this.viewContainerRef);
        this.modalService.addDynamicComponent();
    }

    logout() {
        this.subs.sink = this.service.logout().subscribe(data => {
            this.toast.add({severity: 'success', summary: 'Success', detail: 'logged out successfully'});
            window.sessionStorage.clear();
            localStorage.clear();
            this.router.navigateByUrl('/login');
        });
    }

    getModuleList(){
        this.subs.sink = this.locationService.getUniPerpModuleList().subscribe(data => {
            this.moduleList = data.modules;
        });
    }

    getReportOption(){
        this.subs.sink = this.locationService.getReportOptionList().subscribe(data => {
            this.reportOptionList = data.reportOptions;
        });
    }

    onChangeModuleList(event: any){

    }

    onChangeSubModuleList(event: any){

    }

    onChangeQuestionIdList(event: any){

    }

    onChangeIssueTypeList(event: any){

    }
}

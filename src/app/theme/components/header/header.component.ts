import {
    Component, ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output, ViewChild,
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
import {DataService} from "src/app/data.service";

const KEY = 'time'
let DEFAULT = 0

@Component({
    selector: "uni-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit, OnDestroy {
    @ViewChild('op') op!: ElementRef<HTMLInputElement>;
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
    darkModeSwitch!: HTMLInputElement;

    constructor(
        private modalService: ModalService, private router: Router, private locationService: LocationService,
        private viewContainerRef: ViewContainerRef,
        private service: AuthService,
        private toast: MessageService,
        private dataService: DataService
    ) {

    }

    ngOnInit() {
        this.getModuleList();
        this.getReportOption();
        this.dataService.chatTriggerSource.subscribe((message) => {
            if (message === "open chat window") {
                this.openModal(null)
                //this.openReportModal(this.op, event);
            }
        })
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

        this.darkModeSwitch = document.getElementById('darkmodeswitch') as HTMLInputElement;

        // Read the theme and checked state from the cookie and apply them to the body class and the switch
        const theme = this.getCookie('theme');
        if (theme === 'dark') {
            document.body.classList.add('darkmode');
            this.darkModeSwitch.checked = true;
        } else {
            document.body.classList.add('lightmode');
            this.darkModeSwitch.checked = false;
        }

        const checked = this.getCookie('checked');
        if (checked === 'true') {
            this.darkModeSwitch.checked = true;
        } else if (checked === 'false') {
            this.darkModeSwitch.checked = false;
        }

        // Add event listener to toggle the theme and save it in a cookie
        this.darkModeSwitch.addEventListener('change', () => {
            if (this.darkModeSwitch.checked) {
                document.body.classList.remove('lightmode');
                document.body.classList.add('darkmode');
                this.setCookie('theme', 'dark');
                this.setCookie('checked', 'true');
            } else {
                document.body.classList.remove('darkmode');
                document.body.classList.add('lightmode');
                this.setCookie('theme', 'light');
                this.setCookie('checked', 'false');
            }
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
        //e.preventDefault();
        this.modalService.setRootViewContainerRef(this.viewContainerRef);
        this.modalService.addDynamicComponent();
    }

    openReportModal(op: any, event: any) {
        op.toggle(event);
    }

    logout() {
        this.subs.sink = this.service.logout().subscribe(data => {
            this.toast.add({severity: 'success', summary: 'Success', detail: 'logged out successfully'});
            window.sessionStorage.clear();
            localStorage.clear();
            this.router.navigateByUrl('/login');
        });
    }

    getModuleList() {
        this.subs.sink = this.locationService.getUniPerpModuleList().subscribe(data => {
            this.moduleList = data.modules;
        });
    }

    getReportOption() {
        this.subs.sink = this.locationService.getReportOptionList().subscribe(data => {
            this.reportOptionList = data.reportOptions;
        });
    }

    onChangeModuleList(event: any) {

    }

    onChangeSubModuleList(event: any) {

    }

    onChangeQuestionIdList(event: any) {

    }

    onChangeIssueTypeList(event: any) {

    }

    private setCookie(name: string, value: string, days: number = 365) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value};${expires};path=/`;
    }

    private getCookie(name: string) {
        const cookieValue = document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`);
        return cookieValue ? cookieValue.pop() : '';
    }
}
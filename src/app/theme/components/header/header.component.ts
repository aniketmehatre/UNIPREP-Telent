import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
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
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {matchValidator} from "../../../@Supports/matchvalidator";

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
    public reportSubmitForm: any = FormGroup;
    @Input() breadcrumb: MenuItem[] = [
        {label: "Categories"},
        {label: "Sports"},
    ];
    @Input() expandicon = "";
    @Output() togleSidebar = new EventEmitter();
    private subs = new SubSink();
    userName: any;
    firstChar: any;
    moduleNgModel: number = 1;
    subModuleNgModel: number = 1;
    questionIdNgModel: number = 1;
    reportOptionNgModel: number = 1;
    selectedContryId: any;
    selectedModuleId: any;
    moduleList: any[] = [];
    subModuleList: any[] = [];
    questionList: any[] = [];
    reportOptionList: any[] = [];
    darkModeSwitch!: HTMLInputElement;
    visible: boolean = false;
    showReportSuccess: boolean = false;
    isShowFreeTrailStart: boolean = false;
    isChangePasswordWindowVisible: boolean = false;
    dayHourMin: any;
    constructor(
        private modalService: ModalService, private router: Router, private locationService: LocationService,
        private viewContainerRef: ViewContainerRef, private formBuilder: FormBuilder, private authService: AuthService,
        private service: AuthService, private toast: MessageService, private dataService: DataService
    ) {
        this.dataService.countryIdSource.subscribe(data => {
            this.selectedContryId = Number(data);
            this.getModuleList();
        })
        this.dataService.showTimeOutSource.subscribe(data => {
            this.visible = data;
        })

    }

    isMenuOpen = true;

    toggleMenu() {
        const sidenav: Element | null = document.getElementById('sidenav');
        if (sidenav) {
            this.isMenuOpen = !this.isMenuOpen;
            localStorage.setItem('isMenuOpen', JSON.stringify(this.isMenuOpen));
            this.updateMenuClass();
        }
    }

    updateMenuClass() {
        const sidenav: Element | null = document.getElementById('sidenav');
        if (sidenav) {
            if (this.isMenuOpen) {
                sidenav.classList.remove('menuclosed');
            } else {
                sidenav.classList.add('menuclosed');
            }
        }
    }

    ngOnInit() {
        this.setPasswordForm = this.formBuilder.group({
            password: [
                "",
                [
                    Validators.required,
                    Validators.minLength(8),
                    matchValidator("confirmPassword", true),
                ],
            ],
            confirmPassword: ["", [Validators.required, matchValidator("password")]],
        });
        const storedIsMenuOpen = localStorage.getItem('isMenuOpen');
        if (storedIsMenuOpen) {
            this.isMenuOpen = JSON.parse(storedIsMenuOpen);
        }
        this.updateMenuClass();
        this.reportSubmitForm = this.formBuilder.group({
            moduleId: ["", [Validators.required]],
            submoduleId: ["", [Validators.required]],
            questionId: ["", [Validators.required]],
            reportOption: ["", [Validators.required]],
            comment: ["", []],
        });
        this.getReportOption();
        this.dataService.chatTriggerSource.subscribe((message) => {
            if (message === "open chat window") {
                this.openModal(null)
                //this.openReportModal(this.op, event);
            }
        });
        this.dataService.openReportWindowSource.subscribe((data) => {
            if (data.isVisible) {
                this.moduleNgModel = data.moduleId
                this.subModuleNgModel = data.subModuleId
                this.questionIdNgModel = data.questionId
                this.onChangeSubModuleList(data.subModuleId);
                this.openReportModal(this.op, event);
            }
        });

        this.subs.sink = this.service.selectLogInData$().subscribe(data => {
            if (data) {
                localStorage.setItem('question_left', data.questions_left);
                // if (60 == 60) {
                //     localStorage.setItem(KEY, '60');
                //     this.isShowFreeTrailStart = true;
                //     return;
                // }
                // if (data.time_left < 0) {
                //     this.visible = true;
                //     return;
                // }
                
                localStorage.setItem(KEY, `${data.time_left * 60}`);
            }
        });

        // if (localStorage.getItem(KEY)) {
        //     this.config = {
        //         leftTime: Number(localStorage.getItem(KEY)),
        //         format: 'HH:mm:ss',
        //         notify: 0,
        //         prettyText: (text) => {
        //             return text
        //                 .split(':')
        //                 .map((v) => `<span class="item">${v}</span>`)
        //                 .join('');
        //         },
        //     };
        // } else {
        //     this.config = {
        //         leftTime: 0,
        //         format: 'HH:mm:ss',
        //         notify: 0,
        //         prettyText: (text) => {
        //             return text
        //                 .split(':')
        //                 .map((v) => `<span class="item">${v}</span>`)
        //                 .join('');
        //         },
        //     };
        // }

        this.subs.sink = this.service.getMe().subscribe(data => {
            console.log(data);
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

    exploreNow() {
        this.isShowFreeTrailStart = false;
        localStorage.setItem(KEY, `${60 * 60}`);
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
        } else {
            this.config = {
                leftTime: 0,
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
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }


    handleEvent(ev: any) {
        if (ev.action === 'notify') {
            this.dataService.changeTimeOutStatus(ev.left / 1000);
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
            this.selectedModuleId = 1;

            this.onChangeModuleList(1);
        });
    }

    getReportOption() {
        this.subs.sink = this.locationService.getReportOptionList().subscribe(data => {
            this.reportOptionList = data.reportOptions;
        });
    }

    onChangeModuleList(moduleId: number = 1) {
        let data = {
            moduleid: moduleId
        }
        this.selectedModuleId = moduleId;
        this.locationService.getSubModuleByModule(data).subscribe(res => {
            if (res.status == 404) {

            }
            this.subModuleList = res.submodules;
            this.onChangeSubModuleList(res.submodules[0].id);
        })
    }

    onChangeSubModuleList(subModuleId: any = 1) {
        let data = {
            moduleId: this.selectedModuleId,
            countryId: this.selectedContryId,
            submoduleId: subModuleId
        }
        this.locationService.getModuleQuestionList(data).subscribe(res => {
            if (res.status == 404) {

            }
            this.questionList = res.questions;
            this.questionList.map((x: any,i: number) => {
                x['index'] = i+1;
            })            
        })
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

    onClickSubscribe(dialog: any) {
        dialog.close();
        this.router.navigate(['pages/subscriptions'])
    }

    onSubmit() {
        if (this.reportSubmitForm.invalid) {
            return;
        }
        let data = {
            moduleId: this.reportSubmitForm.value.moduleId,
            submoduleId: this.reportSubmitForm.value.submoduleId,
            questionId: this.reportSubmitForm.value.questionId,
            reportOption: this.reportSubmitForm.value.reportOption,
            comment: this.reportSubmitForm.value.comment
        }

        this.locationService.reportFaqQuestion(data).subscribe(res => {
            if (res.status == 404) {

            }
            this.showReportSuccess = true;
            this.toast.add({severity: 'success', summary: 'Success', detail: 'FAQ Report submitted successfully'});
        })
    }

    public setPasswordForm: any = FormGroup;
    isNotSuccess: boolean = true;
    submitted: boolean = false;

    changePassword() {
        this.isChangePasswordWindowVisible = true;
    }

    get f() {
        return this.setPasswordForm.controls;
    }

    passwordChangeOnClick() {
        if (this.setPasswordForm.value.password !== this.setPasswordForm.value.confirmPassword) {
            this.toast.add({severity: 'info', summary: 'Alert', detail: 'Password does not match'});
        }

        this.locationService.updatePassword(this.setPasswordForm.value.confirmPassword).subscribe(res => {
            if (res.status == 404) {

            }
            this.isChangePasswordWindowVisible = false;
            window.sessionStorage.clear();
            localStorage.clear();
            this.router.navigateByUrl('/login');
            this.toast.add({severity: 'success', summary: 'Success', detail: 'Password Updated Successfully.'});
        })
    }

}
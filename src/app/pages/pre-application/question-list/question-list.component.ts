import {AfterContentChecked, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {PreAppService} from "../pre-app.service";
import {ListQuestion} from "../../../@Models/question-list.model";
import {MenuItem} from "primeng/api";
import {DataService} from 'src/app/data.service';
import {ActivatedRoute} from "@angular/router";
import {SubModuleList} from "../../../@Models/pre-application.model";

@Component({
    selector: 'uni-question-list',
    templateUrl: './question-list.component.html',
    styleUrls: ['./question-list.component.scss']
})
export class QuestionListComponent implements OnInit, AfterContentChecked {
    subModules$!: Observable<SubModuleList[]>;
    listQuestion$!: Observable<ListQuestion[]>;
    selectedQuestion: number = 0;
    positionNumber: number = 0;
    data: any;
    breadCrumb: MenuItem[] = [];
    isQuestionAnswerVisible: boolean = false;
    isRecommendedLinksVisible: boolean = false;
    isRecommendedVideoVisible: boolean = false;
    responsiveOptions: any[] = [];
    message: string = '';
    moduleName: any;
    subModuleId: any;
    videoLinks: any;
    refLink: any;
    countryId: any;
    test: any[] = [];

    constructor(private preAppService: PreAppService, private changeDetector: ChangeDetectorRef,
                private dataService: DataService, private route: ActivatedRoute) {
    }

    ngAfterContentChecked(): void {
        this.changeDetector.detectChanges();
    }

    ngOnInit(): void {
        // this.videoLinku = [
        //     {
        //         "link": "https://www.youtube.com/watch?v=vJFhDC-df34&t=31s",
        //         "title": "Why should you consider UNIABROAD to kickstart your study abroad journey?"
        //     },
        //     {
        //         "link": "https://www.youtube.com/watch?v=eG4-XLekuEw",
        //         "title": "Manish’s Study Abroad Journey | California State University, Los Angeles | Study in USA – UNIABROAD"
        //     }
        // ];
        // this.refLinku = [
        //     {
        //         "reflink": "https://www.youtube.com/watch?v=vJFhDC-df34&t=31s",
        //         "imglink": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FUnited_Kingdom&psig=AOvVaw1mvQjpLnydR8tAbNkPfv7D&ust=1682577204957000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCKiFztb2xv4CFQAAAAAdAAAAABAE"
        //     }
        // ]
        this.countryId = Number(localStorage.getItem('countryId'));

        this.subModuleId = this.route.snapshot.paramMap.get('id');

        this.getSubmoduleName(this.countryId);

        this.dataService.currentMessage.subscribe(message => this.message = message)
        this.breadCrumb = [{label: 'Pre Application'}, {label: this.moduleName}, {label: 'Question'}];

        this.responsiveOptions = [
            {
                breakpoint: '1199px',
                numVisible: 1,
                numScroll: 1
            },
            {
                breakpoint: '991px',
                numVisible: 2,
                numScroll: 1
            },
            {
                breakpoint: '767px',
                numVisible: 1,
                numScroll: 1
            }
        ];
        this.listQuestion$ = this.preAppService.questionList$();
        let data = {
            countryId: Number(localStorage.getItem('countryId')),
            moduleId: 1,
            submoduleId: this.subModuleId
        }
        this.preAppService.loadQuestionList(data);

    }

    getSubmoduleName(countryId: number) {
        this.preAppService.loadSubModules(countryId);
        this.subModules$ = this.preAppService.subModuleList$();
        this.subModules$.subscribe(event => {
            event.filter(data => {
                if (data.id == this.subModuleId) {
                    this.moduleName = data.submodule_name;
                }
            })
        })
    }

    onSubModuleClick(id: any) {
        this.listQuestion$.subscribe(event => {
            this.data = event
        });
        this.selectedQuestion = id;
        this.positionNumber = id;
        this.breadCrumb = [{label: 'Pre Application'}, {label: this.moduleName}, {label: `Question ${id}`}];
        this.isQuestionAnswerVisible = true;

    }

    setPage(page: any) {
        let pageNum: number = 0
        if (page.page < 0) {
            pageNum = this.data.length;
        } else {
            pageNum = page.page
        }
        this.positionNumber = pageNum + 1;
        this.breadCrumb = [{label: 'Pre Application'}, {label: this.moduleName}, {label: `Question ${pageNum + 1}`}];
    }

    clickPrevious(carousel: any, event: any) {
        if (this.selectedQuestion < 2) {
            this.selectedQuestion = this.data.length;
            carousel.navBackward(event, this.selectedQuestion);
            return;
        }
        this.data.filter((res: any) => {
            if (res.id == this.selectedQuestion) {
                console.log('res', res)
                this.refLink = res.reflink;
            }
        })
        this.data.filter((res: any) => {
            if (res.id == this.selectedQuestion) {
                console.log('res 1', res)
                this.videoLinks = res.imagelink;
            }
        })
        carousel.navBackward(event, --this.selectedQuestion)
    }

    clickNext(carousel: any, event: any) {
        if (this.selectedQuestion > this.data.length) {
            this.selectedQuestion = 0;
            carousel.navForward(event, this.selectedQuestion++)
            return;
        }
        console.log(this.data)
        this.data.filter((res: any) => {
            if (res.id == this.selectedQuestion) {
                console.log('res', res)
                this.refLink = res.reflink;
            }
        })
        this.data.filter((res: any) => {
            if (res.id == this.selectedQuestion) {
                console.log('res 1', res)
                this.videoLinks = res.imagelink;
            }
        })
        carousel.navForward(event, this.selectedQuestion++)
    }

    clickPreviousVideo(carouselVideo: any, event: any) {
        if (this.selectedQuestion < 2) {
            this.selectedQuestion = this.data.length;
            carouselVideo.navBackward(event, this.selectedQuestion);
            return;
        }
        this.data.filter((res: any) => {
            if (res.id == this.selectedQuestion) {
                console.log('res', res)
                this.refLink = res.reflink;
            }
        })
        this.data.filter((res: any) => {
            if (res.id == this.selectedQuestion) {
                console.log('res 1', res)
                this.videoLinks = res.imagelink;
            }
        })
        carouselVideo.navBackward(event, --this.selectedQuestion)
    }

    clickNextVideo(carousel: any, event: any) {
        if (this.selectedQuestion > this.data.length) {
            this.selectedQuestion = 0;
            carousel.navForward(event, this.selectedQuestion++)
            return;
        }
        console.log(this.data)
        this.data.filter((res: any) => {
            if (res.id == this.selectedQuestion) {
                console.log('res', res)
                this.refLink = res.reflink;
            }
        })
        this.data.filter((res: any) => {
            if (res.id == this.selectedQuestion) {
                console.log('res 1', res)
                this.videoLinks = res.imagelink;
            }
        })
        carousel.navForward(event, this.selectedQuestion++)
    }

    clickPreviousRef(carouselVideo: any, event: any) {
        if (this.selectedQuestion < 2) {
            this.selectedQuestion = this.data.length;
            carouselVideo.navBackward(event, this.selectedQuestion);
            return;
        }
        this.data.filter((res: any) => {
            if (res.id == this.selectedQuestion) {
                console.log('res', res)
                this.refLink = res.reflink;
            }
        })
        this.data.filter((res: any) => {
            if (res.id == this.selectedQuestion) {
                console.log('res 1', res)
                this.videoLinks = res.imagelink;
            }
        })
        carouselVideo.navBackward(event, --this.selectedQuestion)
    }

    clickNextRef(carousel: any, event: any) {
        if (this.selectedQuestion > this.data.length) {
            this.selectedQuestion = 0;
            carousel.navForward(event, this.selectedQuestion++)
            return;
        }
        console.log(this.data)
        this.data.filter((res: any) => {
            if (res.id == this.selectedQuestion) {
                console.log('res', res)
                this.refLink = res.reflink;
            }
        })
        this.data.filter((res: any) => {
            if (res.id == this.selectedQuestion) {
                console.log('res 1', res)
                this.videoLinks = res.imagelink;
            }
        })
        carousel.navForward(event, this.selectedQuestion++)
    }

    onClickRecommendedVideo(data: any) {
        this.isRecommendedVideoVisible = true;
        // this.data.filter((res: any) => {
        //     if (res.id == this.selectedQuestion) {
        //         this.videoLink = res.videolink
        //     }
        // })
    }

    onClickRecommendedLinks() {
        this.isRecommendedLinksVisible = true;
        // this.data.filter((res: any) => {
        //     if (res.id == this.selectedQuestion) {
        //         console.log('res', res)
        //         this.refLink = res.reflink
        //     }
        // })
    }

    onClickAsk() {
        this.dataService.changeChatOpenStatus("open chat window");
    }

    goToHome(event: any) {
        this.isQuestionAnswerVisible = false;
    }

}

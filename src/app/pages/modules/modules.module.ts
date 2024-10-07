import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModulesRoutingModule } from './modules-routing.module';
import { ModulesComponent } from './modules.component';
import { ListSubModulesComponent } from './list-sub-modules/list-sub-modules.component';
import { QuestionListComponent } from './question-list/question-list.component';
import {BreadcrumbModule} from "primeng/breadcrumb";
import {CarouselModule} from "primeng/carousel";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {DialogModule} from "primeng/dialog";
import {ProgressBarModule} from "primeng/progressbar";
import {SharedModule} from "primeng/api";
import {TooltipModule} from "primeng/tooltip";
import {PipesModule} from "@pipes/pipes.module";
import {TagModule} from "primeng/tag";
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import {NgxUiLoaderModule} from "ngx-ui-loader";
import {SkeletonModule} from "primeng/skeleton";
import { QuizComponent } from './quiz/quiz.component';
import { QuizmenuComponent } from '../quizmenu/quizmenu.component';
import { AccordionModule } from 'primeng/accordion';
import { LearninghubquizComponent } from './learninghubquiz/learninghubquiz.component';
import { LanguagetypequizComponent } from './languagetypequiz/languagetypequiz.component';
import {InputTextModule} from "primeng/inputtext";
import { AcademicToolsComponent } from './academic-tools/academic-tools.component';
import { AcademicToolsStreamComponent } from './academic-tools-stream/academic-tools-stream.component';
import { AcademicToolsQuizComponent } from './academic-tools-quiz/academic-tools-quiz.component';
import { K12ClassComponent } from './k12-class/k12-class.component';
import { K12QuizComponent } from './k12-quiz/k12-quiz.component';
import {ReactiveFormsModule} from "@angular/forms";
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    ModulesComponent,
    ListSubModulesComponent,
    QuestionListComponent,
    QuizComponent,
    QuizmenuComponent,
    LearninghubquizComponent,
    LanguagetypequizComponent,
    AcademicToolsComponent,
    AcademicToolsStreamComponent,
    AcademicToolsQuizComponent,
    K12ClassComponent,
    K12QuizComponent,
  ],
    imports: [
        CommonModule,
        ModulesRoutingModule,
        BreadcrumbModule,
        CarouselModule,
        ConfirmDialogModule,
        DialogModule,
        ProgressBarModule,
        SharedModule,
        TooltipModule,
        PipesModule,
        TagModule,
        PaginatorModule,
        ButtonModule,
        CardModule,
        NgxUiLoaderModule,
        SkeletonModule,
        AccordionModule,
        InputTextModule,
        ReactiveFormsModule,
        ChartsModule
    ]
})
export class ModulesModule { }

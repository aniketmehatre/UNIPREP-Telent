import { NgModule,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FounderstoolComponent } from '../founderstool.component';
import { InputTextModule } from 'primeng/inputtext';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { foundersToolRountingModule } from '../founders-tool-routing.module';
import { TooltipModule } from 'primeng/tooltip';
import { FoundersacademyComponent } from '../foundersacademy/foundersacademy.component';
import {ConfirmationService} from 'primeng/api';
import { FounderstoollistComponent } from '../founderstoollist/founderstoollist.component';


@NgModule({
  declarations: [
    FounderstoolComponent,
    FoundersacademyComponent,
    FounderstoollistComponent
  ],
  imports: [
    CommonModule,
    InputTextModule,
    CarouselModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextareaModule,
    DropdownModule,
    PaginatorModule,
    CardModule,
    DialogModule,
    foundersToolRountingModule,
    TooltipModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [ConfirmationService], 
})
export class FounderstoolModule { }

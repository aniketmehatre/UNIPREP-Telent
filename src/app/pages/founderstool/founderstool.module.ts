import { NgModule,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { foundersToolRountingModule } from './founders-tool-routing.module';
import { FounderstoollistComponent } from './founderstoollist/founderstoollist.component';


@NgModule({
    imports: [
        CommonModule,
        FounderstoollistComponent,
        foundersToolRountingModule,
    ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FounderstoolModule { }

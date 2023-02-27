import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconPipe } from './icon.pipe';
import {CountryImagePipe} from "@pipes/country-image.pipe";



@NgModule({
  declarations: [IconPipe, CountryImagePipe],
  imports: [
    CommonModule
  ],
  exports: [IconPipe, CountryImagePipe]
})
export class PipesModule { }

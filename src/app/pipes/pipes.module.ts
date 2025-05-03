import { NgModule } from '@angular/core';
import { CountryImagePipe } from './country-image.pipe';
import { SafePipe } from './safe.pipe';
import { DateDiffInMonthsPipe } from './getDiffInMonths.pipe';

@NgModule({
  imports: [
    CountryImagePipe,
    SafePipe,
    DateDiffInMonthsPipe
  ],
  exports: [
    CountryImagePipe,
    SafePipe,
    DateDiffInMonthsPipe
  ]
})
export class PipesModule { }

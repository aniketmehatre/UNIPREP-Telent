import { NgModule } from '@angular/core';
import { CountryImagePipe } from './country-image.pipe';
import { SafePipe } from './safe.pipe';

@NgModule({
  imports: [
    CountryImagePipe,
    SafePipe
  ],
  exports: [
    CountryImagePipe,
    SafePipe
  ]
})
export class PipesModule { }

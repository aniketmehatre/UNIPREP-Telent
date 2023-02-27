import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'countryImage'
})
export class CountryImagePipe implements PipeTransform {

  transform(name: string): string {
    return "assets/icons/" + name.replace(/\s/g, "").trim() + ".png";
  }

}

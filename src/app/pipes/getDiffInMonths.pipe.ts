import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateDiffInMonths'
})
export class DateDiffInMonthsPipe implements PipeTransform {
  transform(value: string | Date): number {
    if (!value) {
      return 0;
    }

    const currentDate = new Date();
    const inputDate = new Date(value);

    const yearsDiff = currentDate.getFullYear() - inputDate.getFullYear();
    const monthsDiff = currentDate.getMonth() - inputDate.getMonth();

    return yearsDiff * 12 + monthsDiff;
  }
}
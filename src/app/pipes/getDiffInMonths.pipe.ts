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
    const yearsDiff = inputDate.getFullYear() - currentDate.getFullYear();
    const monthsDiff = inputDate.getMonth() - currentDate.getMonth();

    return Math.abs(yearsDiff * 12 + monthsDiff);
  }
}
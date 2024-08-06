import { Pipe, PipeTransform } from '@angular/core';
import * as dayjs from 'dayjs';
import * as relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return 'Invalid date';
    value = dayjs(value).format('DD-MM-YYYY HH:mm:ss');
    return dayjs(value).fromNow();
  }

}
import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'momentDate',
})
export class MomentDatePipe implements PipeTransform {
  transform(
    dateString: string,
    format: string = 'YYYY-MM-DD HH:mm:ss'
  ): string {
    const date = moment(dateString);
    if (date.isValid()) {
      return date.format(format);
    }
    return 'Invalid Date';
  }
}

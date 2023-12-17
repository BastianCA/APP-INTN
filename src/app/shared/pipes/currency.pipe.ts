import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'separadorMiles',
})
export class CurrencyPipe implements PipeTransform {
  transform(value: number): string {
    if (value || value === 0) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
    return '';
  }
}

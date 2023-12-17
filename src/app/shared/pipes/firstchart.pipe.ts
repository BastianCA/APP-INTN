import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstChart'
})
export class FirstChart implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    return value.charAt(0).toUpperCase();
  }
}

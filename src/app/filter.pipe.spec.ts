import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterPipe',
})
export class FilterPipe implements PipeTransform {
  transform(items: string[], searchText: string): string[] {
    if (!searchText) return items;
    searchText = searchText.toLowerCase();
    return items.filter((item) => item.toLowerCase().includes(searchText));
  }
}
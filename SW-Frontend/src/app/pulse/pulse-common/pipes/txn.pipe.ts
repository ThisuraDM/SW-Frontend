import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'txn'
})
export class TxnPipe implements PipeTransform {

  transform(value: any): unknown {
    return value.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
  }

}

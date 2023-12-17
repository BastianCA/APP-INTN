import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CapitalizePipe } from '../capitalize.pipe';
import { CurrencyPipe } from '../currency.pipe';
import { FirstChart } from '../firstchart.pipe';



@NgModule({
  declarations: [CapitalizePipe,CurrencyPipe,FirstChart],
  imports: [CommonModule],
  exports:[CapitalizePipe,CurrencyPipe,FirstChart]
})
export class PipesModule { }

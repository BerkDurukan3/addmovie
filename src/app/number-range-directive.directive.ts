import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumberRange]'
})
export class NumberRangeDirective {

  @HostListener('beforeinput', ['$event'])
  onBeforeInput(event: InputEvent) {
    const input = event.target as HTMLInputElement;
    const upcomingValue = input.value + event.data;

    if (!this.isValueValid(upcomingValue, event)) {
      event.preventDefault();
    }
  }

  isValueValid(value: string, event: any): boolean {
    if (value === "" || event.inputType === 'deleteContentBackward' || event.inputType === 'deleteContentForward') {
      return true;
    }
    return /^(0|([1-9]\d{0,1}))(\.\d{0,1})?$/.test(value) && parseFloat(value) <= 10;
  }
}
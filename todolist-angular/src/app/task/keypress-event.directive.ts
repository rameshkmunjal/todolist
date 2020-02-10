import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appKeypressEvent]'
})
export class KeypressEventDirective {
  @HostListener('keydown', ['$event']) onKeyDown(e) {
    if (e.ctrlKey && e.keyCode == 90) {
      console.log('ctrl and z keys pressed');
    }
  }

}

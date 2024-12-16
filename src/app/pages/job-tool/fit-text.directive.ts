import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
    selector: '[appFitText]'
})
export class FitTextDirective {
    constructor(private el: ElementRef, private renderer: Renderer2) {}

    @HostListener('window:resize')
    onResize() {
        this.resizeText();
    }

    ngOnInit() {
        this.resizeText();
    }

    private resizeText() {
        const parentWidth = this.el.nativeElement.parentElement.offsetWidth;
        const fontSize = Math.min(parentWidth / 10, 24); // Adjust 24 to your desired max size
        this.renderer.setStyle(this.el.nativeElement, 'font-size', `${fontSize}px`);
    }
}

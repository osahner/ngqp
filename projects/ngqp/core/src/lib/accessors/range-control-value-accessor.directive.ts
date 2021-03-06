import { Directive, ElementRef, forwardRef, HostListener, Provider, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/** @ignore */
const NGQP_RANGE_VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RangeControlValueAccessorDirective),
    multi: true
};

/** @ignore */
@Directive({
    selector: 'input[type=range][queryParamName],input[type=range][queryParam]',
    providers: [NGQP_RANGE_VALUE_ACCESSOR],
})
export class RangeControlValueAccessorDirective implements ControlValueAccessor {

    private fnChange = (_: number | null) => {};
    private fnTouched = () => {};

    @HostListener('input', ['$event'])
    public onInput(event: UIEvent) {
        const value = (event.target as HTMLInputElement).value;
        this.fnChange(value === '' ? null : parseFloat(value));
    }

    @HostListener('blur')
    public onBlur() {
        this.fnTouched();
    }

    constructor(private renderer: Renderer2, private elementRef: ElementRef<HTMLInputElement>) {
    }

    public writeValue(value: any) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'value', parseFloat(value));
    }

    public registerOnChange(fn: any) {
        this.fnChange = fn;
    }

    public registerOnTouched(fn: any) {
        this.fnTouched = fn;
    }

    public setDisabledState(isDisabled: boolean) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
    }

}
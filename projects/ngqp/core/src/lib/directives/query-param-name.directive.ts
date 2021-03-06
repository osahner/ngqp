import { Directive, Inject, Input, OnChanges, OnDestroy, Optional, Self, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { QueryParamGroupService } from './query-param-group.service';
import { QueryParamAccessor } from './query-param-accessor.interface';
import { selectValueAccessor } from '../accessors/util';

/**
 * Binds a {@link QueryParam} to a DOM element.
 *
 * This directive accepts the name of a {@link QueryParam} inside its parent {@link QueryParamGroup}.
 * It binds this parameter to the host element, which is required to have a [ControlValueAccessor]
 * {@link https://angular.io/api/forms/ControlValueAccessor}.
 */
@Directive({
    selector: '[queryParamName]',
})
export class QueryParamNameDirective implements QueryParamAccessor, OnChanges, OnDestroy {

    /**
     * The name of the {@link QueryParam} inside its parent {@link QueryParamGroup}.
     * Note that this does not refer to the [parameter name]{@link QueryParam#urlParam}.
     */
    @Input('queryParamName')
    public set name(name: string) {
        this._name = name;
    }

    public get name(): string {
        if (!this._name) {
            throw new Error(`No queryParamName has been specified.`);
        }

        return this._name;
    }

    /** @internal */
    public valueAccessor: ControlValueAccessor;

    private _name: string | null = null;

    /** @internal */
    constructor(
        @Optional() private groupService: QueryParamGroupService,
        @Optional() @Self() @Inject(NG_VALUE_ACCESSOR) valueAccessors: ControlValueAccessor[],
    ) {
        if (!this.groupService) {
            throw new Error(`No parent configuration found. Did you forget to add [queryParamGroup]?`);
        }

        this.valueAccessor = selectValueAccessor(valueAccessors);
    }

    /** @ignore */
    public ngOnChanges(changes: SimpleChanges) {
        const nameChange = changes['name'];
        if (nameChange) {
            if (!nameChange.firstChange) {
                this.groupService.deregisterQueryParamDirective(nameChange.previousValue);
            }

            if (nameChange.currentValue) {
                this.groupService.registerQueryParamDirective(this);
            }
        }
    }

    /** @ignore */
    public ngOnDestroy() {
        if (this.groupService) {
            this.groupService.deregisterQueryParamDirective(this.name);
        }
    }

}

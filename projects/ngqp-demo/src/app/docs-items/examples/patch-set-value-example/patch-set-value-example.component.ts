import { Component } from '@angular/core';
import { QueryParamBuilder, QueryParamGroup } from '@ngqp/core';

declare const require: Function;

@Component({
    selector: 'demo-patch-set-value-example',
    templateUrl: './patch-set-value-example.component.html',
})
export class PatchSetValueExampleComponent {

    public paramGroup: QueryParamGroup;

    public markup = require('!raw-loader!./patch-set-value-example.component.html');
    public typescript = require('!raw-loader!./patch-set-value-example.component.ts');

    constructor(private qpb: QueryParamBuilder) {
        this.paramGroup = qpb.group({
            p1: 'p1',
            p2: 'p2',
        });
    }

    public patchGroup() {
        this.paramGroup.patchValue({ p1: 'Hello!' });
    }

    public setGroup() {
        this.paramGroup.setValue({ p1: 'Hello!' });
    }

}
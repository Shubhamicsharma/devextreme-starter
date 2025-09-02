import { Injectable } from '@angular/core';

@Injectable()
export class AppInfoService {
    constructor() {}

    public get title() {
        return 'Devextreme Starter';
    }

    public get currentYear() {
        return new Date().getFullYear();
    }
}

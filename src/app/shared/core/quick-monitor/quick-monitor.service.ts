import { inject, Injectable } from '@angular/core';
import { RVHttpService } from '../../../core/services/http.service';
import { Observable, of, switchMap } from 'rxjs';
import { ApiResponse } from '../../../core/models/api-response.model';
import { RatesTrendMonitor } from '../../../features/quick-monitor/rates-trend-monitor/rates-trend-monitor';

@Injectable({
    providedIn: 'root',
})
export class QuickMonitorService {
    private httpService = inject(RVHttpService);

    // Get rates trend monitor with date
    public getQuickMonitorData<T>(
        date: Date,
        type: 'Past' | 'Live',
        tableType:
            | 'irmomentum'
            | 'currencymomentum'
            | 'commoditiesmomentum'
            | 'cmdmomentum'
    ): Observable<T> {
        return this.httpService.getQuickMonitorData<T>(date, type, tableType).pipe(
            switchMap((response: ApiResponse<T>) => {
                return of(response.Model);
            })
        );
    }
}

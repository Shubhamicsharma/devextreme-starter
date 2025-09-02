import { inject, Injectable } from '@angular/core';
import { RVHttpService } from '../../../core/services/http.service';
import { Observable, of, pipe, switchMap } from 'rxjs';
import { ApiResponse } from '../../../core/models/api-response.model';

@Injectable({
    providedIn: 'root'
})
export class CacheService {

    private httpService = inject(RVHttpService);

    // Get daily GAV
    public getCommonCacheData(params: any[]): Observable<any> {
        return this.httpService.getCacheLookupsData(params).pipe(
            switchMap((response: any) => {
                // Store the access token in the local storage

                // Return a new observable with the response
                return of(response.Model);
            })
        );;
    }
}

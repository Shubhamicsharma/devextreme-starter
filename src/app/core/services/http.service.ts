import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, Observable, tap, throwError, map } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { Credentials } from '../auth/auth.service';
import { CommonCacheEnum } from '../../shared/core/cache/cache.enum';
import { RatesTrendMonitor } from '../../features/quick-monitor/rates-trend-monitor/rates-trend-monitor';
import { AllocationTemplateResponse, AllocationTemplate } from '../models/allocation-template.model';

@Injectable({
    providedIn: 'root',
})
export class RVHttpService {
    private http = inject(HttpClient);

    // Base API URL
    private baseUrl = environment.apiUrl;

    // Auth
    public login(credentials: Credentials): Observable<ApiResponse<any>> {
        return this.http.post<ApiResponse<any>>(
            `${this.baseUrl}/Auth/Login`,
            credentials
        );
    }

    // Cache Lookups Data
    public getCacheLookupsData(params: any): Observable<ApiResponse<any>> {
        // get the numeric value of the parameter from CommonCacheEnum, convert to string and join using comma
        if (!Array.isArray(params)) {
            console.error(
                'Invalid params: Expected an array, but got:',
                params
            );
            return throwError(
                () => new Error('Invalid params: Expected an array.')
            );
        }

        // Process the params array
        const cacheEnumValues = params
            .map((value: any) => {
                const enumValue = CommonCacheEnum[value];

                return enumValue !== undefined ? enumValue : null;
            })
            .filter((value: any) => value !== null)
            .join(',');

        return this.http.get<ApiResponse<any>>(
            `${this.baseUrl}/Cache/CommonLookupData?cacheTypes=${cacheEnumValues}`
        );
    }

    // Quick Monitor
    // Get rates trend monitor with date
    public getQuickMonitorData<T>(
        date: Date,
        type: 'Past' | 'Live',
        tableType:
            | 'irmomentum'
            | 'currencymomentum'
            | 'commoditiesmomentum'
            | 'indexmomentum'
    ): Observable<ApiResponse<T>> {
        return this.http.get<ApiResponse<T>>(
            `${
                this.baseUrl
            }/QuickMonitor/GetQuickMonitorData?date=${date.toISOString()}&type=${type}&tableType=${tableType}`
        );
    }

    // Allocation Templates
    public getAllocationTemplates(): Observable<AllocationTemplateResponse> {
        return this.http.get<AllocationTemplateResponse>(
            `${this.baseUrl}/Cache/GetAllocationTemplate`
        );
    }

    // Fund Combination and Allocation (new endpoint)
    public getFundCombination(valuationDate: string): Observable<any> {
        return this.http.get<any>(
            `${this.baseUrl}/Lookups/GetFundCombination?valuationdate=${valuationDate}`
        );
    }

    // CDS Option
    public insertCdsOptionData(data: any[]): Observable<ApiResponse<string>> {
        return this.http.post<ApiResponse<string>>(
            `${this.baseUrl}/swaps/InsertCDSOptionData`, 
            data
        );
    }

}

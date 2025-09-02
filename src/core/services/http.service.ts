import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { Credentials } from '../auth/auth.service';
import { GetHTVTradesDataQueryParams } from '../../shared/core/views/views.model';
import { CommonCacheEnum } from '../../shared/core/cache/cache.enum';

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
            credentials,
        );
    }

    // PNL Reporting
    // - Daily GAV
    public getDailyGav(): Observable<ApiResponse<any>> {
        return this.http.get<ApiResponse<any>>(
            `${this.baseUrl}/PnlReporting/GetGAVDailyData?shareClass=Class%20B&fund=RVMaster&year=2024`,
        );
    }

    // Views
    // - Get HTV Trades Data
    // public getHTVTradesData(queryParams: GetHTVTradesDataQueryParams): Observable<ApiResponse<any>> {
    //     // Remove params that are null or undefined
    //     const filteredParams = Object.fromEntries(Object.entries(queryParams).filter(([_, v]) => v != null && v !== ''));
    //     // Convert to query string
    //     const params = new URLSearchParams(filteredParams).toString();
    //     // Make the API call
    //     return this.http.get<ApiResponse<any>>(`${this.baseUrl}/Views/GetHTVTradesData?${params}`);
    // }

    public getHTVTradesData(
        queryParams: GetHTVTradesDataQueryParams,
    ): Observable<ApiResponse<any>> {
        // Remove params that are null or undefined
        const filteredParams = Object.fromEntries(
            Object.entries(queryParams).filter(
                ([_, v]) => v != null && v !== '',
            ),
        );

        // Handle array values by converting them to comma-separated strings without spaces
        const processedParams = Object.fromEntries(
            Object.entries(filteredParams).map(([key, value]) => {
                if (Array.isArray(value)) {
                    return [key, value.join(',')]; // Join array values with commas
                }
                return [key, value];
            }),
        );

        // Convert to query string
        const params = new URLSearchParams(processedParams).toString();

        // Log the processed params

        // Make the API call
        return this.http.get<ApiResponse<any>>(
            `${this.baseUrl}/Views/GetHTVTradesData?${params}`,
        );
    }

    // Cache Lookups Data
    public getCacheLookupsData(params: any): Observable<ApiResponse<any>> {
        // get the numeric value of the parameter from CommonCacheEnum, convert to string and join using comma
        if (!Array.isArray(params)) {
            console.error(
                'Invalid params: Expected an array, but got:',
                params,
            );
            return throwError(
                () => new Error('Invalid params: Expected an array.'),
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
            `${this.baseUrl}/Cache/CommonLookupData?cacheTypes=${cacheEnumValues}`,
        );
    }

    // Trades
    // - Get Trade New
    public getTradeNew(tradeId: number): Observable<ApiResponse<any>> {
        return this.http.get<ApiResponse<any>>(
            `${this.baseUrl}/Trade/GetTradeNew?TradeId=${tradeId}`,
        );
    }
}

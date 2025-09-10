export interface CurrencyTrendMonitorModel {
  Id: number;
  HeaderKey: number;
  Currency: string;
  SpotFwd: number;
  Z_Sc_1m: number;
  Z_Sc_3m: number;
  Z_Sc_1y: number;
  Chg_1d_pct: number;
  Chg_1w_pct: number;
  Z_1w_chg: number;
  Chg_1m_pct: number;
  Z_1m_chg: number;
  Std_3m: number;
  Std_1y: number;
  Short_Trend: number;
  Long_Trend: number;
  Short_Term: number;
  Long_Term: number;
}

export interface RatesTrendMonitorModel {
    Date: string;
    Rates_5y: string;
    Live: number;
    Z_Sc_1m: number;
    Z_Sc_3m: number;
    Z_Sc_1y: number;
    Chg_1d_bps: number;
    Chg_1w_bps: number;
    Z_1w_chg: number;
    Chg_1m_bps: number;
    Z_1m_chg: number;
    Std_3m: number;
    Std_1y: number;
    Short_Trend: number;
    Long_Trend: number;
    Short_Term: number;
    Long_Term: number;
}

export interface IndexTrendMonitorModel {
  Id: number;
  HeaderKey: number;
  Index: string;
  Live: number;
  Z_Sc_1m: number;
  Z_Sc_3m: number;
  Z_Sc_1y: number;
  Chg_1d_pct: number;
  Chg_1w_pct: number;
  Z_1w_chg: number;
  Chg_1m_pct: number;
  Z_1m_chg: number;
  Std_3m: number;
  Std_1y: number;
  Short_Trend: number;
  Long_Trend: number;
  Short_Term: number;
  Long_Term: number;
}

export interface CommodityTrendMonitorModel {
  Id: number;
  HeaderKey: number;
  Commodity: string;
  Live: number;
  Z_Sc_1m: number;
  Z_Sc_3m: number;
  Z_Sc_1y: number;
  Chg_1d_pct: number;
  Chg_1w_pct: number;
  Z_1w_chg: number;
  Chg_1m_pct: number;
  Z_1m_chg: number;
  Std_3m: number;
  Std_1y: number;
  Short_Trend: number;
  Long_Trend: number;
  Short_Term: number;
  Long_Term: number;
}

export interface QuickMonitorData<T> {
    Time: Date;
    Data: T[];
}

export interface QuickMonitorDataResponse<T> {
    Type: 'Past' | 'Live';
    Data: QuickMonitorData<T>[];
}

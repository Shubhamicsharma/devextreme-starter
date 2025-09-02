export interface TradeAccounts {
    Name: string;
    OwnerId: number;
    ShortCode: string;
    Id: number;
}

export interface Currency {
    Code: string;
    isActive: boolean;
    Id: string;
}

export interface CounterParties {
    Name: string;
    Id: number;
    isActive: boolean;
}

export interface Users {
    Id: number;
    Name: string;
    Initials: string;
    IsEnabled: boolean;
    ShortUser: string;
    PerformanceAnalysisViewRights: boolean;
    UserPnlRights: string;
    Roles: { Name: string; Id: number }[];
    MultiUsers: { UserId: number; TraderId: number; Id: number; ModifiedOn: string; ModifiedBy: number }[];
}

export interface TradeNames {
    Name: string;
    ThemeId: number;
    AssetClass: string;
    RiskCountryId: number;
    Capital: number;
    IsApproved: boolean;
    ApprovedBy: number;
    TraderId: number;
    ScalingFactor: number;
    TradeNameSubCategories: any[];
    TradeCategoryId: number;
    EnteredOn: string;
    Id: number;
    ModifiedOn: string;
    ModifiedBy: number;
}

export interface AssetTypes {
    Name: string;
    Id: number;
}

export interface Countries {
    ShortName: string;
    Name: string;
    ISO2Code: string;
    ISO3Code: string;
    IsActive: boolean;
    Id: number;
    ModifiedOn: string;
    ModifiedBy: number;
}

export interface Themes {
    Name: string;
    Description: string;
    IsActive: boolean;
    Id: number;
}

export interface TradeTypes {
    Name: string;
    Id: number;
}

export interface ISIN {
    ISINCode: string;
    BBGType: string;
    CountryId: number;
    CurrencyId: number;
    AssetQuality: string;
    Description: string;
    PointValue: number;
    IsCouponOverride: boolean;
    Id: number;
    ModifiedOn: string;
    ModifiedBy: number;
}

export interface TradarAccounts {
    Name: string;
    Id: number;
}

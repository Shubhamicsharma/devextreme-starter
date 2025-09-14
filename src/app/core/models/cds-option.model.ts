export interface CDSOptionModel {
  id: number;
  accountId: number;
  tradeDate: string | Date;
  tradeNameId: number;
  settlementDate: string | Date;
  isinId: number;
  capitalAllocation: number;
  securityId: string;
  description: string;
  tradePrice: number;
  traderRationale: string;
  tradarAccount: string;
  tradarPayAccount: string;
  finUpdateTime: string | Date;
  currencyId: number;
  notional: number;
  enteredById?: number | null;

  // ----------------- CDSOption Fields -----------------
  tradeId: number;
  strikeRate?: number | null;
  upfront?: number | null;
  upfrontDate?: Date | string | null;
  upfrontCCY?: string | null;
  payFreq?: string | null;
  tradeAction?: string | null;
  dayCount?: string | null;
  firstCouponDate?: Date | string | null;
  redCode?: string | null;
  accruedInterest?: number | null;
  underlyingISIN?: string | null;
  indeptAmt?: number | null;
  indeptCCY?: string | null;
  optionType?: string | null;
  optionStyle?: string | null;
  exchangeRate?: number | null;
  spread?: number | null;
  cdsIndexName?: string | null;
  settlementType?: string | null;
  optionExpiryDate?: Date | string | null;
}
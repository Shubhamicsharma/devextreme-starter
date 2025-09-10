// allocation-template.model.ts
export interface AllocationTemplate {
  Id: number;
  TradeId: number;
  TemplateName: string;
  OwnerId: number;
  ModifiedOn: string;
  ModifiedBy: number;
  IsDeleted: boolean;
  DeletedOn?: string;
  DeletedBy?: number;
}

export interface AllocationTemplateResponse {
  Success: boolean;
  Model: {
    Trade_AllocationTemplate: AllocationTemplate[];
  };
}

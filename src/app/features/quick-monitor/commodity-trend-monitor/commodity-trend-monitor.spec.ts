import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommodityTrendMonitor } from './commodity-trend-monitor';

describe('CommodityTrendMonitor', () => {
  let component: CommodityTrendMonitor;
  let fixture: ComponentFixture<CommodityTrendMonitor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommodityTrendMonitor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommodityTrendMonitor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

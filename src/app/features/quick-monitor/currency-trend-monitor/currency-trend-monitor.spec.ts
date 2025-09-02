import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyTrendMonitor } from './currency-trend-monitor';

describe('CurrencyTrendMonitor', () => {
  let component: CurrencyTrendMonitor;
  let fixture: ComponentFixture<CurrencyTrendMonitor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrencyTrendMonitor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrencyTrendMonitor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

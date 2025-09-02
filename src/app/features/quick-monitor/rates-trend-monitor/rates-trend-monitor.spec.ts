import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatesTrendMonitor } from './rates-trend-monitor';

describe('RatesTrendMonitor', () => {
  let component: RatesTrendMonitor;
  let fixture: ComponentFixture<RatesTrendMonitor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RatesTrendMonitor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RatesTrendMonitor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexTrendMonitor } from './index-trend-monitor';

describe('IndexTrendMonitor', () => {
  let component: IndexTrendMonitor;
  let fixture: ComponentFixture<IndexTrendMonitor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndexTrendMonitor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexTrendMonitor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

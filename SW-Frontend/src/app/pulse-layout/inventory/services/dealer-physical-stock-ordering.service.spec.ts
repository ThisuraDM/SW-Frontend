import { TestBed } from '@angular/core/testing';

import { DealerPhysicalStockOrderingService } from './dealer-physical-stock-ordering.service';

describe('DealerPhysicalStockOrderingService', () => {
  let service: DealerPhysicalStockOrderingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DealerPhysicalStockOrderingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

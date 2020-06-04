import { TestBed } from '@angular/core/testing';

import { ReceiptsServiceService } from './receipts-service.service';

describe('ReceiptsServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReceiptsServiceService = TestBed.get(ReceiptsServiceService);
    expect(service).toBeTruthy();
  });
});

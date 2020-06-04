import { TestBed } from '@angular/core/testing';

import { ProfileserviceService } from './profileservice.service';

describe('ProfileserviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProfileserviceService = TestBed.get(ProfileserviceService);
    expect(service).toBeTruthy();
  });
});

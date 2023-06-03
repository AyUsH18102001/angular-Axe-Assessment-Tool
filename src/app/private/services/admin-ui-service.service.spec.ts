import { TestBed } from '@angular/core/testing';

import { AdminUiServiceService } from './admin-ui-service.service';

describe('AdminUiServiceService', () => {
  let service: AdminUiServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminUiServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

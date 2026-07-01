import { TestBed } from '@angular/core/testing';

import { RestClientService } from './rest-client.service';
import { provideHttpClient, withXhr } from '@angular/common/http';

describe('RestClientService', () => {
  let service: RestClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [provideHttpClient(withXhr()) ]});
    service = TestBed.inject(RestClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

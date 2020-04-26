import { TestBed, inject } from '@angular/core/testing';

import { CountryCodeService } from './country-code.service';

describe('CountryCodeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CountryCodeService]
    });
  });

  it('should be created', inject([CountryCodeService], (service: CountryCodeService) => {
    expect(service).toBeTruthy();
  }));
});

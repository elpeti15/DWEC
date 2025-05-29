import { TestBed } from '@angular/core/testing';

import { PhysiosService } from './physios.service';

describe('PhysiosService', () => {
  let service: PhysiosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhysiosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

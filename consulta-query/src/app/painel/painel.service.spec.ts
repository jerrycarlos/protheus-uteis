import { TestBed } from '@angular/core/testing';

import { PainelService } from './painel.service';

describe('PainelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PainelService = TestBed.get(PainelService);
    expect(service).toBeTruthy();
  });
});

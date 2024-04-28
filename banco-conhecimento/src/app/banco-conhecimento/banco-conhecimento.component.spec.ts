import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BancoConhecimentoComponent } from './banco-conhecimento.component';

describe('BancoConhecimentoComponent', () => {
  let component: BancoConhecimentoComponent;
  let fixture: ComponentFixture<BancoConhecimentoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BancoConhecimentoComponent]
    });
    fixture = TestBed.createComponent(BancoConhecimentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

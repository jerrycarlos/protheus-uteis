import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PainelComponent } from './painel.component';

describe('PainelComponent', () => {
  let component: PainelComponent;
  let fixture: ComponentFixture<PainelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PainelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PainelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

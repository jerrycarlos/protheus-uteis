import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NotificacoesComponent } from './notificacoes.component';

describe('NotificacoesComponent', () => {
  let component: NotificacoesComponent;
  let fixture: ComponentFixture<NotificacoesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificacoesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificacoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

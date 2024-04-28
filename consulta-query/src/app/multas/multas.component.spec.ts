import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MultasComponent } from './multas.component';

describe('MultasComponent', () => {
  let component: MultasComponent;
  let fixture: ComponentFixture<MultasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MultasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

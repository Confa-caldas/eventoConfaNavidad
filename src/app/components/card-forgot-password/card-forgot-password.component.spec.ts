import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardForgotPasswordComponent } from './card-forgot-password.component';

describe('CardForgotPasswordComponent', () => {
  let component: CardForgotPasswordComponent;
  let fixture: ComponentFixture<CardForgotPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardForgotPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

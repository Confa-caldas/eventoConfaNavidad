import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardRegisterComponent } from './card-register.component';

describe('CardRegisterComponent', () => {
  let component: CardRegisterComponent;
  let fixture: ComponentFixture<CardRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

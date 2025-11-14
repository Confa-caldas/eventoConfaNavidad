import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPersonasNavidadComponent } from './lista-personas-navidad.component';

describe('ListaPersonasNavidadComponent', () => {
  let component: ListaPersonasNavidadComponent;
  let fixture: ComponentFixture<ListaPersonasNavidadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaPersonasNavidadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaPersonasNavidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

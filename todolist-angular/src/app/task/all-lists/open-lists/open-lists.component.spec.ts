import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenListsComponent } from './open-lists.component';

describe('OpenListsComponent', () => {
  let component: OpenListsComponent;
  let fixture: ComponentFixture<OpenListsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenListsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

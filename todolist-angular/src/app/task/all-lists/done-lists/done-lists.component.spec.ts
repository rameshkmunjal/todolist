import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoneListsComponent } from './done-lists.component';

describe('DoneListsComponent', () => {
  let component: DoneListsComponent;
  let fixture: ComponentFixture<DoneListsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoneListsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoneListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

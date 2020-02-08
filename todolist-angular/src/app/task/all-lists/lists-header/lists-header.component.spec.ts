import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListsHeaderComponent } from './lists-header.component';

describe('ListsHeaderComponent', () => {
  let component: ListsHeaderComponent;
  let fixture: ComponentFixture<ListsHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListsHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

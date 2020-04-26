import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubItemsComponent } from './sub-items.component';

describe('SubItemsComponent', () => {
  let component: SubItemsComponent;
  let fixture: ComponentFixture<SubItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

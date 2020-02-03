import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskNavComponent } from './task-nav.component';

describe('TaskNavComponent', () => {
  let component: TaskNavComponent;
  let fixture: ComponentFixture<TaskNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

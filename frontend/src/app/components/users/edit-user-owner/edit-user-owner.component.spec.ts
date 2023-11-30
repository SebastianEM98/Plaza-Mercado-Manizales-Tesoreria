import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserOwnerComponent } from './edit-user-owner.component';

describe('EditUserOwnerComponent', () => {
  let component: EditUserOwnerComponent;
  let fixture: ComponentFixture<EditUserOwnerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditUserOwnerComponent]
    });
    fixture = TestBed.createComponent(EditUserOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

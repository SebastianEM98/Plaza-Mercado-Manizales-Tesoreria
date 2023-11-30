import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRenterComponent } from './edit-renter.component';

describe('EditRenterComponent', () => {
  let component: EditRenterComponent;
  let fixture: ComponentFixture<EditRenterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditRenterComponent]
    });
    fixture = TestBed.createComponent(EditRenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

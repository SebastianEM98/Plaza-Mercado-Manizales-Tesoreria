import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteRenterComponent } from './delete-renter.component';

describe('DeleteRenterComponent', () => {
  let component: DeleteRenterComponent;
  let fixture: ComponentFixture<DeleteRenterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteRenterComponent]
    });
    fixture = TestBed.createComponent(DeleteRenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

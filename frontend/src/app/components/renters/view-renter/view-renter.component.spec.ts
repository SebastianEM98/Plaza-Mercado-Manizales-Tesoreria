import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRenterComponent } from './view-renter.component';

describe('ViewRenterComponent', () => {
  let component: ViewRenterComponent;
  let fixture: ComponentFixture<ViewRenterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewRenterComponent]
    });
    fixture = TestBed.createComponent(ViewRenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

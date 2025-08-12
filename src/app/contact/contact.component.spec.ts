import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { ContactComponent } from './contact.component';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ContactComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when empty', () => {
    expect(component.contactForm.valid).toBeFalse();
  });

  it('should validate required fields', () => {
    const nameControl = component.contactForm.get('nameControl');
    const emailControl = component.contactForm.get('emailControl');
    const messageControl = component.contactForm.get('messageControl');

    nameControl?.setValue('');
    emailControl?.setValue('');
    messageControl?.setValue('');
    expect(component.contactForm.valid).toBeFalse();

    nameControl?.setValue('Test User');
    emailControl?.setValue('test@example.com');
    messageControl?.setValue('This is a message.');
    expect(component.contactForm.valid).toBeTrue();
  });

  it('should validate email format', () => {
    const emailControl = component.contactForm.get('emailControl');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBeFalse();

    emailControl?.setValue('valid@email.com');
    expect(emailControl?.valid).toBeTrue();
  });

  it('should disable submit button when form is invalid', () => {
    fixture.detectChanges();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBeTrue();

    component.contactForm.get('nameControl')?.setValue('Test');
    component.contactForm.get('emailControl')?.setValue('test@test.com');
    component.contactForm.get('messageControl')?.setValue('A valid message');
    fixture.detectChanges();
    expect(button.disabled).toBeFalse();
  });

  it('should call submitForm when form is submitted and valid', () => {
    spyOn(component, 'submitForm');
    component.contactForm.get('nameControl')?.setValue('Test');
    component.contactForm.get('emailControl')?.setValue('test@test.com');
    component.contactForm.get('messageControl')?.setValue('A valid message');
    fixture.detectChanges();

    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    expect(component.submitForm).toHaveBeenCalled();
  });
});

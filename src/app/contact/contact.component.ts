import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';  
import { NotificationService } from '../notification/notification.service';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, CommonModule], 
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  contactForm = new FormGroup({
    nameControl: new FormControl('', Validators.required),
    emailControl: new FormControl('', [Validators.required, Validators.email]),
    messageControl: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(20)]),
  })
  constructor(private notify: NotificationService){}

  submitForm() {
    console.log(this.contactForm.valid);
    console.log(this.contactForm.get('messageControl')?.errors)
    this.notify.addNotification({type: 'INFO', message: 'Thank you for your message! We will get back to you soon.'});
    
  }

}

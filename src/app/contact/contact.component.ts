import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  contactForm = new FormGroup({
    nameControl: new FormControl('', Validators.required),
    emailControl: new FormControl('', Validators.required),
    messageControl: new FormControl('', Validators.required),
  })
 

  submitForm() {
    console.log(this.contactForm.valid);
    // if(this.nameControl.dirty){
    //   alert('You changed the name field');
    // }
  }

}

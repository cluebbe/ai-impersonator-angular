import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  contactForm = new FormGroup({
    nameControl: new FormControl(''),
    emailControl: new FormControl(''),
    messageControl: new FormControl('')
  })
 

  submitForm() {
    console.log(this.contactForm.value);
    // if(this.nameControl.dirty){
    //   alert('You changed the name field');
    // }
  }

}

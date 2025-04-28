import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  nameControl = new FormControl('');
  emailControl = new FormControl('');
  messageControl = new FormControl('');

  submitForm() {
    if(this.nameControl.dirty){
      alert('You changed the name field');
    }
  }

}

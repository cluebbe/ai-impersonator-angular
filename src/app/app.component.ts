import { Component} from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChatComponent } from './chat/chat.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterModule, ChatComponent],
})

export class AppComponent {
 
}

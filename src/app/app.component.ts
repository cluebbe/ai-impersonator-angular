import { Component} from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterModule,  HeaderComponent],
})

export class AppComponent {
  title = 'ai-impersonator-angular';
}

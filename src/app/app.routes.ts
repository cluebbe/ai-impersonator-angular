import { Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { ContactComponent } from './contact/contact.component';

export const routes: Routes = [
    {path: '', component: ChatComponent},
    {path: 'home', component: ChatComponent},
    {path: 'contact', component: ContactComponent},
    {path: '**', component: ChatComponent}   
];

import { Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { ContactComponent } from './contact/contact.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
    {path: '', component: ChatComponent},
    {path: 'home', component: ChatComponent},
    {path: 'contact', component: ContactComponent},
    {path: 'dashboard', component: DashboardComponent, canActivate: [authGuard]},
    {path: '**', component: ChatComponent}   
];

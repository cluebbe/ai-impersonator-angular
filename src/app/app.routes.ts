import { Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { ContactComponent } from './contact/contact.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    {path: '', component: ChatComponent},
    {path: 'home', component: ChatComponent},
    {path: 'contact', component: ContactComponent},
    {path: 'login', component: LoginComponent},
    {path: 'dashboard', component: DashboardComponent, canActivate: [authGuard]},
    {path: '**', component: ChatComponent}   
];

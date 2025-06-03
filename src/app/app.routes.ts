import { Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { ContactComponent } from './contact/contact.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';

export const routes: Routes = [
    {path: '', component: ChatComponent},
    {path: 'home', component: ChatComponent},
    {path: 'contact', component: ContactComponent},
    {path: 'login', component: LoginComponent},
    {path: 'admin', component: AdminComponent, canActivate: [authGuard], data: { role: 'admin' }},
    {path: 'dashboard', component: DashboardComponent, canActivate: [authGuard]},
    {path: '**', component: ChatComponent}   
];

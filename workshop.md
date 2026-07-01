# Angular Workshop: AI Impersonator App

Build an Angular application step by step. Each exercise describes what to implement — the solution is hidden in the details block below it.

---

## Part 1: Navbar, Home Page & Contact Form

### Exercise 1 — Bootstrap the App

Create a new Angular application. The root component (`AppComponent`) should:
- Use a standalone component approach with `app.config.ts`
- Render a `<app-header>` component and a `<router-outlet>`
- Provide `HttpClient` and the router in `app.config.ts`

<details>
<summary>Solution</summary>

**src/index.html**
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>AiImpersonatorAngular</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

**src/main.ts**
```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
```

**src/app/app.config.ts**
```ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withXhr } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withXhr()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes)
  ]
};
```

**src/app/app.component.ts**
```ts
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RouterModule, HeaderComponent],
})
export class AppComponent {}
```

**src/app/app.component.html**
```html
<app-header></app-header>
<router-outlet />
```

</details>

---

### Exercise 2 — Define the Routes

Define the application routes in `app.routes.ts`. For now, add:
- `''` and `'home'` → `ChatComponent` (the home page)
- `'contact'` → `ContactComponent`
- `'**'` → `ChatComponent` (wildcard fallback)

<details>
<summary>Solution</summary>

**src/app/app.routes.ts**
```ts
import { Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { ContactComponent } from './contact/contact.component';

export const routes: Routes = [
    { path: '', component: ChatComponent },
    { path: 'home', component: ChatComponent },
    { path: 'contact', component: ContactComponent },
    { path: '**', component: ChatComponent }
];
```

</details>

---

### Exercise 3 — Create the Header / Navbar Component

Generate a `HeaderComponent` that:
- Shows a "Home" link on the left
- Shows "Dashboard", "Admin", "Contact" links aligned to the right using flexbox
- Uses `routerLink` for navigation (not `<a href>`)
- Styles links with a pointer cursor and bold on hover

<details>
<summary>Solution</summary>

**src/app/header/header.component.ts**
```ts
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './header.component.css'
})
export class HeaderComponent {}
```

**src/app/header/header.component.html**
```html
<div id="container">
  <div class="link" id="home" routerLink="home">Home</div>
  <div id="links">
    <div class="link" routerLink="dashboard">Dashboard</div>
    <div class="link" routerLink="admin">Admin</div>
    <div class="link" routerLink="contact">Contact</div>
  </div>
</div>
```

**src/app/header/header.component.css**
```css
#container {
    display: flex;
    padding: 0px 30px;
    .link {
        cursor: pointer;
        pointer-events: auto;
        &:hover {
            font-weight: bold;
        }
    }
    #links {
        flex-grow: 1;
        display: flex;
        gap: 20px;
        justify-content: right;
    }
}
```

</details>

---

### Exercise 4 — Create the Home / Chat Component

Create a `ChatComponent` that:
- Has a text input for the person to impersonate and a message input
- Displays a scrollable list of chat messages (sender + text)
- Sends the message to an API via a `RestClientService` on button click or Enter key
- Uses `@ViewChild` to auto-scroll the chat container after a new message arrives
- Uses `[(ngModel)]` for two-way binding (template-driven)

<details>
<summary>Solution</summary>

**src/app/chat/chat.component.ts**
```ts
import { Component, ElementRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RestClientService } from '../rest-client.service';
import { NotificationService } from '../notification/notification.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormsModule],
})
export class ChatComponent {
  @ViewChild('chatMessagesContainer') chatMessagesContainer!: ElementRef;

  public userInput: string = '';
  public personToImpersonate: string = '';
  chatMessages: { sender: string; text: string }[] = [];

  constructor(private restClient: RestClientService, private notify: NotificationService) {}

  sendMessage() {
    if (this.userInput.trim()) {
      const userMessage = this.userInput.trim();
      this.chatMessages.push({ sender: 'You', text: userMessage });
      this.userInput = '';
      this.restClient.sendMessage(userMessage, this.personToImpersonate)
        .subscribe({
          next: (response: any) => {
            const assistantMessage = response.choices[0]?.message?.content || 'No response received.';
            this.chatMessages.push({ sender: this.personToImpersonate, text: assistantMessage });
            setTimeout(() => {
              this.chatMessagesContainer.nativeElement.scrollTop = this.chatMessagesContainer.nativeElement.scrollHeight;
            }, 500);
          },
          error: (error: any) => {
            this.notify.addNotification({ type: 'ERROR', message: 'Error: ' + error.message + '\nCause: ' + error.cause.error });
          }
        });
    }
  }
}
```

**src/app/chat/chat.component.html**
```html
<div class="chat-container">
  <div class="chat-banner">
    <img src="/banner.jpg" alt="image" />
  </div>
  <div class="chat-box">
    <div class="input-label-group">
      <label for="personToImpersonate">Chat with any known person you like: &nbsp;&nbsp;</label>
      <input
        id="personToImpersonate"
        type="text"
        [(ngModel)]="personToImpersonate"
        placeholder="Type the person to impersonate..."
        class="input-field small-input"
      />
    </div>
    <div class="chat-messages" #chatMessagesContainer>
      @for (message of chatMessages; track message) {
        <div class="message">
          <strong class="message-sender">{{ message.sender }}:</strong>
          <span class="message-text">{{ message.text }}</span>
        </div>
      }
    </div>
    <div class="input-group">
      <div class="input-box">
        <input
          type="text"
          [(ngModel)]="userInput"
          placeholder="Type your message here..."
          (keyup.enter)="sendMessage()"
          class="input-msg large-input"
        />
        <button (click)="sendMessage()" class="send-button">
          <img src="send.svg" alt="Send" class="send-icon" />
        </button>
      </div>
    </div>
  </div>
</div>
```

</details>

---

### Exercise 5 — Create the REST Client Service

Create a `RestClientService` that sends a POST request to the xAI API (`https://api.x.ai/v1/chat/completions`). It should:
- Read the API key from `environment.xaiApiKey`
- Set the `Authorization: Bearer <key>` header
- Use model `grok-4`, max 100 tokens, temperature 0.7
- Prepend a system prompt instructing the model to impersonate the given person
- Store the API key in a gitignored `src/environments/environment.ts` file

<details>
<summary>Solution</summary>

**src/environments/environment.example.ts** *(commit this as a template)*
```ts
export const environment = {
  xaiApiKey: 'add-your-api-key-here',
};
```

**src/environments/environment.ts** *(gitignored — add your real key here)*
```ts
export const environment = {
  xaiApiKey: 'your-actual-key',
};
```

**.gitignore** — add this line:
```
src/environments/environment.ts
```

**src/app/rest-client.service.ts**
```ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestClientService {

  constructor(private http: HttpClient) { }

  sendMessage(userMessage: string, personToImpersonate: string) {
    const userMessagePretext = "Please answer the following question as if you were an actor impersonating " + personToImpersonate + " (100 Tokens max): ";
    const apiKey = environment.xaiApiKey;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    });

    const requestBody = {
      model: 'grok-4',
      messages: [{ role: 'user', content: userMessagePretext + userMessage }],
      temperature: 0.7,
      max_tokens: 100,
      stream: false,
    };

    return this.http.post('https://api.x.ai/v1/chat/completions', requestBody, { headers })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('A client-side or network error occurred:', error.error);
    } else {
      console.error('Backend returned code ' + error.status, error.error);
    }
    return throwError(() => new Error('Something bad happened; please try again later.', { cause: error.error }));
  }
}
```

</details>

---

### Exercise 6 — Create the Notification System

Build a reusable notification system consisting of:
1. A **model** interface `NotificationMessage` with `type: 'ERROR' | 'INFO'` and `message: string`
2. A **service** `NotificationService` that holds a list of notifications using an Angular `signal`, exposes it as readonly, and auto-removes notifications after 50 seconds
3. A **component** `NotificationComponent` that renders all active notifications with an `[ngClass]` binding for styling and a close button
4. A **module** `NotificationModule` that declares and exports the component
5. Use the `@for` control flow block in the template

<details>
<summary>Solution</summary>

**src/app/notification/notification-message.model.ts**
```ts
export interface NotificationMessage {
    type: 'ERROR' | 'INFO';
    message: string;
}
```

**src/app/notification/notification.service.ts**
```ts
import { Injectable, signal } from '@angular/core';
import { NotificationMessage } from './notification-message.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notifications = signal<NotificationMessage[]>([]);
  notifications$ = this.notifications.asReadonly();

  addNotification(notification: NotificationMessage) {
    this.notifications.update((prev) => [...prev, notification]);
    setTimeout(() => {
      this.removeNotification(notification);
    }, 50000);
  }

  removeNotification(notification: NotificationMessage) {
    this.notifications.update(current =>
      current.filter(n => n !== notification)
    );
  }
}
```

**src/app/notification/notification/notification.component.ts**
```ts
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class NotificationComponent {
  constructor(public notificationService: NotificationService) {}
}
```

**src/app/notification/notification/notification.component.html**
```html
<div class="notification-container">
  @for (notification of notificationService.notifications$(); track notification) {
    <div class="notification" [ngClass]="{'error': notification.type === 'ERROR', 'info': notification.type === 'INFO'}">
      <button class="close-button" (click)="notificationService.removeNotification(notification)">
        <img src="x-close.svg" alt="Close" />
      </button>
      <p>{{ notification.message }}</p>
    </div>
  }
</div>
```

**src/app/notification/notification.module.ts**
```ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification/notification.component';

@NgModule({
  declarations: [NotificationComponent],
  imports: [CommonModule],
  exports: [NotificationComponent]
})
export class NotificationModule { }
```

Register `NotificationModule` in `AppComponent`:
```ts
imports: [RouterModule, HeaderComponent, NotificationModule],
```

Add `<app-notification></app-notification>` to `app.component.html`.

</details>

---

### Exercise 7 — Create the Contact Form

Create a `ContactComponent` using **reactive forms** with the following fields and validation rules:
- `name` — required
- `email` — required, must be a valid email format
- `message` — required, min 10 characters, max 200 characters

Requirements:
- Show validation error messages only after the field has been touched or dirtied
- Disable the submit button when the form is invalid
- On submit, show an INFO notification: *"Thank you for your message! We will get back to you soon."*

<details>
<summary>Solution</summary>

**src/app/contact/contact.component.ts**
```ts
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '../notification/notification.service';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule],
  templateUrl: './contact.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  contactForm = new FormGroup({
    nameControl: new FormControl('', Validators.required),
    emailControl: new FormControl('', [Validators.required, Validators.email]),
    messageControl: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]),
  });

  constructor(private notify: NotificationService) {}

  submitForm() {
    this.notify.addNotification({ type: 'INFO', message: 'Thank you for your message! We will get back to you soon.' });
  }
}
```

**src/app/contact/contact.component.html**
```html
<form class="form-container" [formGroup]="contactForm" (ngSubmit)="$event.preventDefault(); submitForm();">
    <div class="form-group">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" formControlName="nameControl">
        @if (contactForm.get('nameControl')?.invalid && (contactForm.get('emailControl')?.dirty || contactForm.get('emailControl')?.touched)) {
            <div class="validation-error">
                @if (contactForm.get('nameControl')?.errors?.['required']) {
                    <div>Name is required.</div>
                }
            </div>
        }
    </div>
    <div class="form-group">
        <label for="email">Email:</label>
        <input type="text" id="email" name="email" formControlName="emailControl">
        @if (contactForm.get('emailControl')?.invalid && (contactForm.get('emailControl')?.dirty || contactForm.get('emailControl')?.touched)) {
            <div class="validation-error">
                @if (contactForm.get('emailControl')?.errors?.['required']) {
                    <div>Email is required.</div>
                }
                @if (contactForm.get('emailControl')?.errors?.['email']) {
                    <div>Invalid format</div>
                }
            </div>
        }
    </div>
    <div class="form-group">
        <label for="message">Message:</label>
        <textarea id="message" name="message" formControlName="messageControl"></textarea>
        @if (contactForm.get('messageControl')?.invalid && (contactForm.get('messageControl')?.dirty || contactForm.get('messageControl')?.touched)) {
            <div class="validation-error">
                @if (contactForm.get('messageControl')?.errors?.['required']) {
                    <div>Message is required.</div>
                }
                @if (contactForm.get('messageControl')?.errors?.['minlength']) {
                    <div>At least {{contactForm.get('messageControl')?.errors?.['minlength'].requiredLength}} characters</div>
                }
                @if (contactForm.get('messageControl')?.errors?.['maxlength']) {
                    <div>At most {{contactForm.get('messageControl')?.errors?.['maxlength'].requiredLength}} characters</div>
                }
            </div>
        }
    </div>
    <div class="form-group">
        <button type="submit" [disabled]="contactForm.invalid">Submit</button>
    </div>
</form>
```

</details>

---

## Part 2: Login, Auth Guard & Dashboard

### Exercise 8 — Create the AuthService

Create an `AuthService` that:
- Defines a `User` interface with `username`, `password`, and `role` fields
- Loads a list of users from `/userlist.json` via `HttpClient` in an `init()` method
- Implements `login(username, password)` — finds the matching user and sets `currentUser`
- Implements `logout()`, `isAuthenticated()`, `getCurrentUser()`, and `getCurrentUserRole()`
- Call `authService.init()` from `AppComponent.ngOnInit()`

<details>
<summary>Solution</summary>

**src/app/auth.service.ts**
```ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface User {
  username: string;
  password: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  users: User[] = [];
  currentUser: User | null = null;

  constructor(private http: HttpClient) { }

  init() {
    this.http.get<User[]>('/userlist.json').subscribe({
      next: (users) => this.users = users,
      error: (err) => {
        console.error('Failed to load user list:', err);
        this.users = [];
      }
    });
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  login(username: string, password: string): boolean {
    const user = this.users.find(u => u.username === username && u.password === password);
    if (user) {
      this.currentUser = user;
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUser = null;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getCurrentUserRole(): string | null {
    return this.currentUser ? this.currentUser.role : null;
  }
}
```

**src/app/app.component.ts** — call `init()` on startup:
```ts
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.init();
  }
}
```

**public/userlist.json** *(example)*
```json
[
  { "username": "admin", "password": "admin123", "role": "admin" },
  { "username": "user1", "password": "pass1", "role": "guest" }
]
```

</details>

---

### Exercise 9 — Create the Login Component

Create a `LoginComponent` using **template-driven forms** (`FormsModule`) that:
- Has `username` and `password` inputs bound with `[(ngModel)]`
- On submit, calls `authService.login()` and navigates to `/dashboard` on success
- On failure, shows an ERROR notification
- Reads an optional `returnUrl` query parameter and redirects there after a successful login instead of always going to `/dashboard`

<details>
<summary>Solution</summary>

**src/app/login/login.component.ts**
```ts
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../notification/notification.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true
})
export class LoginComponent {
  public username = '';
  public password = '';
  private returnUrl: string = '/dashboard';

  constructor(
    private router: Router,
    public authService: AuthService,
    public notificationService: NotificationService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      if (params['returnUrl']) {
        this.returnUrl = params['returnUrl'];
      }
    });
  }

  login() {
    this.authService.login(this.username, this.password);
    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.returnUrl]);
    } else {
      this.notificationService.addNotification({
        type: 'ERROR',
        message: 'Login failed. Please check your username and password.',
      });
    }
  }
}
```

**src/app/login/login.component.html**
```html
<div class="login-container">
  <h2>Login</h2>
  <form (ngSubmit)="login()">
    <div class="form-group">
      <label for="username">Username:</label>
      <input id="username" type="text" [(ngModel)]="username" name="username" required />
    </div>
    <div class="form-group">
      <label for="password">Password:</label>
      <input id="password" type="password" [(ngModel)]="password" name="password" required />
    </div>
    <button type="submit">Login</button>
  </form>
</div>
```

</details>

---

### Exercise 10 — Create a Functional Auth Guard

Create a functional route guard `authGuard` using `CanActivateFn` that:
- Allows access if the user is authenticated
- If a `role` is specified in the route's `data`, also checks that the user's role matches
- On insufficient role: shows an ERROR notification and blocks navigation
- If not authenticated: shows an ERROR notification, redirects to `/login` with `returnUrl` as a query param, and blocks navigation

<details>
<summary>Solution</summary>

**src/app/auth.guard.ts**
```ts
import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { NotificationService } from './notification/notification.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);
  const expectedRole = route.data['role'];

  if (authService.isAuthenticated()) {
    if (expectedRole) {
      const userRole = authService.getCurrentUserRole();
      if (userRole === expectedRole) {
        return true;
      } else {
        notificationService.addNotification({
          type: 'ERROR',
          message: 'Insufficient rights to access this page.',
        });
        return false;
      }
    }
    return true;
  } else {
    notificationService.addNotification({
      type: 'ERROR',
      message: 'You must be logged in to access this page.',
    });
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
};
```

</details>

---

### Exercise 11 — Protect Routes & Update the Navbar

Update `app.routes.ts` to:
- Protect `/dashboard` with `authGuard` (any authenticated user)
- Protect `/admin` with `authGuard` and require `role: 'admin'`
- Add routes for `'login'` and `'admin'`

Update the `HeaderComponent` to:
- Show a **Login** link only when the user is **not** authenticated
- Show a **Logout** link only when the user **is** authenticated
- Inject `AuthService` and call `authService.logout()` followed by `window.location.reload()` on logout

<details>
<summary>Solution</summary>

**src/app/app.routes.ts**
```ts
import { Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { ContactComponent } from './contact/contact.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
    { path: '', component: ChatComponent },
    { path: 'home', component: ChatComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'login', component: LoginComponent },
    { path: 'admin', component: AdminComponent, canActivate: [authGuard], data: { role: 'admin' } },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
    { path: '**', component: ChatComponent }
];
```

**src/app/header/header.component.ts**
```ts
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
    window.location.reload();
  }
}
```

**src/app/header/header.component.html**
```html
<div id="container">
  <div class="link" id="home" routerLink="home">Home</div>
  <div id="links">
    <div class="link" routerLink="dashboard">Dashboard</div>
    <div class="link" routerLink="admin">Admin</div>
    @if (!authService.isAuthenticated()) {
      <div class="link" routerLink="login">Login</div>
    }
    @if (authService.isAuthenticated()) {
      <div class="link" (click)="logout()">Logout</div>
    }
    <div class="link" routerLink="contact">Contact</div>
  </div>
</div>
```

</details>

---

### Exercise 12 — Create the Dashboard with a Traffic Light Component

Create a `DashboardComponent` that:
- Shows a welcome message
- Displays a conditional message *"Consider upgrading your membership"* if the user's role is `'guest'`
- Iterates over a `serverLoads` array (objects with `name` and `value` properties) using `@for`
- For each server, renders an `<app-traffic-light>` component passing `[value]` and `[height]="50"`

Then create a `TrafficLightComponent` that:
- Accepts `@Input() value: number` (0–100) and `@Input() height: number`
- Computes `currentColor` as `'green'` (< 33), `'yellow'` (< 66), or `'red'` (≥ 66)
- Uses computed style objects for proportional sizing
- Applies `[class.on]` to activate only the current color light

<details>
<summary>Solution</summary>

**src/app/dashboard/dashboard.component.ts**
```ts
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '../auth.service';
import { TrafficLightComponent } from '../traffic-light/traffic-light.component';

@Component({
  selector: 'app-dashboard',
  imports: [TrafficLightComponent],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  serverLoads: any = [
    { name: 'Server A', value: 12 },
    { name: 'Server B', value: 45 },
    { name: 'Server C', value: 78 },
    { name: 'Server D', value: 30 },
    { name: 'Server E', value: 55 },
    { name: 'Server F', value: 90 },
    { name: 'Server G', value: 22 },
    { name: 'Server H', value: 67 },
    { name: 'Server I', value: 49 },
    { name: 'Server J', value: 5 }
  ];

  constructor(public authService: AuthService) {}
}
```

**src/app/dashboard/dashboard.component.html**
```html
<p>Welcome to your personal dashboard</p>

@if (authService.getCurrentUserRole() === 'guest') {
  <p>Consider upgrading your membership</p>
}

@for (serverload of this.serverLoads; track serverload.name) {
  <div class="server-row">
    <app-traffic-light [value]="serverload.value" [height]="50"></app-traffic-light>
    <span>{{ serverload.name }}: {{ serverload.value }}%</span>
  </div>
}
```

**src/app/traffic-light/traffic-light.component.ts**
```ts
import { CommonModule } from '@angular/common';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-traffic-light',
  imports: [CommonModule],
  templateUrl: './traffic-light.component.html',
  styleUrls: ['./traffic-light.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true
})
export class TrafficLightComponent {
  @Input() value: number = 0;
  @Input() height: number = 100;

  get currentColor(): 'red' | 'yellow' | 'green' {
    if (this.value < 33) return 'green';
    if (this.value < 66) return 'yellow';
    return 'red';
  }

  get containerStyle() {
    return { height: `${this.height}px` };
  }

  get trafficLightStyle() {
    return {
      width: `${this.height * 0.5}px`,
      padding: `${this.height * 0.16}px ${this.height * 0.08}px`,
      gap: `${this.height * 0.12}px`,
      borderRadius: `${this.height * 0.2}px`
    };
  }

  get lightStyle() {
    const size = this.height * 0.32;
    return { width: `${size}px`, height: `${size}px` };
  }
}
```

**src/app/traffic-light/traffic-light.component.html**
```html
<div class="traffic-light-container" [ngStyle]="containerStyle">
  <div class="traffic-light" [ngStyle]="trafficLightStyle">
    <div class="light red"    [class.on]="currentColor === 'red'"    [ngStyle]="lightStyle"></div>
    <div class="light yellow" [class.on]="currentColor === 'yellow'" [ngStyle]="lightStyle"></div>
    <div class="light green"  [class.on]="currentColor === 'green'"  [ngStyle]="lightStyle"></div>
  </div>
</div>
```

</details>

# Angular Workshop: AI Impersonator App

Build an Angular application step by step. Each exercise describes what to implement — the solution is hidden in the details block below it.

This file is self-contained: Part 0 sets up everything you need (Node, the Angular CLI, the
project, the API key and the static assets), Parts 1 and 2 are the exercises, and the appendix
lists the finished project layout.

**Contents**

- [Part 0: Environment Setup](#part-0-environment-setup) — do this before the workshop
- [Part 1: Navbar, Home Page & Contact Form](#part-1-navbar-home-page--contact-form) — Exercises 1–7
- [Part 2: Login, Auth Guard & Dashboard](#part-2-login-auth-guard--dashboard) — Exercises 8–12
- [Appendix A: Finished project structure](#appendix-a-finished-project-structure)
- [Appendix B: What you learned](#appendix-b-what-you-learned)

---

## Part 0: Environment Setup

> Do this part before the workshop starts. It takes ~15 minutes, most of it `npm install`.
> Everything you need is in this file — you do not need the repository or the README.

### What you will build

A single-page Angular application that lets you chat with an AI impersonating any well-known
person, plus a contact form, a login with role-based route guards, and a dashboard. The AI
answers come from the [xAI Grok API](https://x.ai) called directly from the browser.

### 0.1 Prerequisites

| Tool | Version | Check with |
|---|---|---|
| Node.js | 22 LTS or newer (this workshop was written on 26.4) | `node -v` |
| npm | 10 or newer (ships with Node) | `npm -v` |
| Angular CLI | 22.x | `ng version` |
| Editor | VS Code + the "Angular Language Service" extension (recommended) | — |
| Browser | Any current Chrome / Edge / Firefox / Safari | — |
| xAI API key | any key with credit — see 0.2 | — |

**Installing Node.js**

- macOS / Linux (recommended, lets you switch versions):
  ```bash
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
  nvm install 22        # or: nvm install 26
  nvm use 22
  ```
- Windows: download the LTS installer from <https://nodejs.org> (or `winget install OpenJS.NodeJS.LTS`).

**Installing the Angular CLI**

```bash
npm install -g @angular/cli@22
ng version            # must print Angular CLI: 22.x
```

If `ng` is not found after installing, your npm global bin directory is not on the `PATH`.
Print it with `npm config get prefix` and add the `bin` subfolder to your `PATH`, or just use
`npx ng ...` instead of `ng ...` everywhere in this workshop.

### 0.2 Get an xAI API key

1. Sign up at <https://console.x.ai> and create a team.
2. Add a payment method / credits — the free tier is not enough for the `grok-4` model.
3. Go to **API Keys → Create API Key**, copy the key (it starts with `xai-`).
4. Keep it somewhere safe for step 0.5. You can only see it once.

The workshop caps each answer at 100 tokens, so a full workshop day costs cents, not dollars.

> **No key?** Everything except Exercise 4/5 (the chat) works without one. The chat page will
> render and show an error notification instead of an answer. You can still finish all other
> exercises. If you want a working chat without xAI, swap the URL, model and key in
> `RestClientService` for any other OpenAI-compatible chat-completions endpoint — the request
> and response shapes are identical.

### 0.3 Create the workspace

```bash
ng new ai-impersonator-angular \
  --style=css \
  --routing \
  --ssr=false \
  --zoneless=false \
  --file-name-style-guide=2016 \
  --test-runner=karma \
  --package-manager=npm

cd ai-impersonator-angular
```

Why these flags:

| Flag | Reason |
|---|---|
| `--style=css` | Plain CSS, no preprocessor to install |
| `--routing` | Creates `app.routes.ts`, needed from Exercise 2 on |
| `--ssr=false` | Client-side only; SSR would break `localStorage`/direct API calls |
| `--zoneless=false` | Keeps `zone.js` and `provideZoneChangeDetection`, which the solutions use |
| `--file-name-style-guide=2016` | Generates `header.component.ts` instead of `header.ts`, matching every path in this workshop |
| `--test-runner=karma` | Matches the `*.spec.ts` files in the solutions |

On Windows PowerShell, put the whole command on one line (drop the `\` line continuations).

### 0.4 Verify the empty app runs

```bash
npm start          # same as: ng serve
```

Open <http://localhost:4200>. You should see the Angular starter page. Stop the server with
`Ctrl+C`. If port 4200 is taken, use `ng serve --port 4300`.

### 0.5 Add your API key

The key must never be committed. Create two files:

**`src/environments/environment.example.ts`** — the committed template:

```ts
export const environment = {
  xaiApiKey: 'add-your-api-key-here',
};
```

**`src/environments/environment.ts`** — your real key, gitignored:

```bash
mkdir -p src/environments
cp src/environments/environment.example.ts src/environments/environment.ts
```

Edit `src/environments/environment.ts` and paste your key:

```ts
export const environment = {
  xaiApiKey: 'xai-...your-key...',
};
```

Then append this to `.gitignore`:

```
# Local environment (contains secrets)
src/environments/environment.ts
```

> **Security note:** anything in `environment.ts` is bundled into the JavaScript the browser
> downloads, so the key is visible to anyone who opens the app. That is fine for a local
> workshop; in production the API call belongs on a backend that keeps the key server-side.

### 0.6 Add the static assets

Everything in `public/` is copied to the web root by the CLI, so `public/banner.jpg` is served
at `/banner.jpg`.

**`public/userlist.json`** — the in-memory user store loaded by `AuthService` in Part 2:

```json
[
  {
    "username": "admin",
    "password": "verySecret",
    "role": "admin"
  },
  {
    "username": "user",
    "password": "verySecret",
    "role": "user"
  },
  {
    "username": "guest",
    "password": "verySecret",
    "role": "guest"
  }
]
```

**`public/send.svg`** — the send arrow in the chat input (Exercise 4):

```xml
<svg xmlns="http://www.w3.org/2000/svg" fill="#000000" height="800px" width="800px"
     viewBox="0 0 512.001 512.001">
  <path d="M483.927,212.664L66.967,25.834C30.95,9.695-7.905,42.023,1.398,80.368l21.593,89.001
    c3.063,12.622,11.283,23.562,22.554,30.014l83.685,47.915c6.723,3.85,6.738,13.546,0,17.405l-83.684,47.915
    c-11.271,6.452-19.491,17.393-22.554,30.015l-21.594,89c-9.283,38.257,29.506,70.691,65.569,54.534l416.961-186.83
    C521.383,282.554,521.333,229.424,483.927,212.664z M359.268,273.093l-147.519,66.1c-9.44,4.228-20.521,0.009-24.752-9.435
    c-4.231-9.44-0.006-20.523,9.434-24.752l109.37-49.006l-109.37-49.006c-9.44-4.231-13.665-15.313-9.434-24.752
    c4.229-9.44,15.309-13.666,24.752-9.435l147.519,66.101C373.996,245.505,374.007,266.49,359.268,273.093z"/>
</svg>
```

**`public/x-close.svg`** — the dismiss button on notifications (Exercise 6):

```xml
<svg xmlns="http://www.w3.org/2000/svg" fill="none" height="24" width="24" viewBox="0 0 24 24">
  <path d="m18 6-12 12m0-12 12 12" stroke="#000" stroke-linecap="round"
        stroke-linejoin="round" stroke-width="2"/>
</svg>
```

**`public/banner.jpg`** — the header image on the chat page. Use any wide image you like
(roughly 1200×300 works well). If you skip it, the chat page shows a broken-image icon and
nothing else breaks.

### 0.7 Angular CLI commands used in this workshop

You never have to create files by hand — generate them and paste the solution in:

```bash
ng generate component header          # → src/app/header/header.component.{ts,html,css,spec.ts}
ng generate component chat
ng generate component contact
ng generate component login
ng generate component dashboard
ng generate component admin
ng generate component traffic-light
ng generate component notification/notification

ng generate service rest-client       # → src/app/rest-client.service.ts
ng generate service auth
ng generate service notification/notification

ng generate guard auth                # choose "CanActivate" when prompted
```

Short forms work too: `ng g c header`, `ng g s auth`, `ng g g auth`.

Other commands you will need:

| Command | What it does |
|---|---|
| `npm start` / `ng serve` | Dev server with live reload on <http://localhost:4200> |
| `ng serve --port 4300` | Same, on another port |
| `ng build` | Production build into `dist/` |
| `ng test` | Runs the Karma unit tests |
| `ng version` | Prints CLI / Angular / Node versions |

### 0.8 Demo credentials (Part 2)

Loaded from `public/userlist.json` at startup:

| Username | Password | Role | Can reach |
|---|---|---|---|
| `admin` | `verySecret` | admin | Dashboard **and** Admin |
| `user` | `verySecret` | user | Dashboard |
| `guest` | `verySecret` | guest | Dashboard (sees an upgrade prompt) |

### 0.9 Troubleshooting

| Symptom | Cause / fix |
|---|---|
| `ng: command not found` | CLI not on `PATH` — use `npx ng ...`, or add `$(npm config get prefix)/bin` to `PATH` |
| `Port 4200 is already in use` | Another dev server is running — `ng serve --port 4300`, or kill it with `lsof -ti:4200 \| xargs kill` |
| `Cannot find module './environments/environment'` | You skipped 0.5 — `environment.ts` is gitignored and must be created locally |
| Chat shows `Backend returned code 401` | API key missing, wrong, or still `add-your-api-key-here` — check `src/environments/environment.ts`, then restart `ng serve` (environment files are only read at build time) |
| Chat shows `Backend returned code 429` | Rate limit or no credits on the xAI account |
| Chat shows `A client-side or network error occurred` (status 0) | No internet, a corporate proxy, or an ad blocker blocking `api.x.ai` |
| Login always fails | `public/userlist.json` missing or malformed — open <http://localhost:4200/userlist.json> and check that the JSON loads |
| `NullInjectorError: No provider for HttpClient` | `provideHttpClient()` missing from `app.config.ts` (Exercise 1) |
| Template errors after generating a component | Standalone components need their dependencies in `imports: [...]` — e.g. `FormsModule`, `ReactiveFormsModule`, `RouterLink` |
| Changes not showing up | Hard reload (`Cmd/Ctrl+Shift+R`); if that fails, stop the server, `rm -rf .angular/cache`, `ng serve` |

### 0.10 Ready check

Before Exercise 1, confirm:

- [ ] `ng version` prints Angular CLI 22.x and Node 22+
- [ ] `npm start` serves the app at <http://localhost:4200>
- [ ] `src/environments/environment.ts` exists and holds your real `xai-` key
- [ ] `src/environments/environment.ts` is listed in `.gitignore`
- [ ] `public/userlist.json`, `public/send.svg` and `public/x-close.svg` exist

---

## Part 1: Navbar, Home Page & Contact Form

### Exercise 1 — Bootstrap the App

Starting from the empty workspace you created in Part 0, wire up the application shell. The root component (`AppComponent`) should:
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

---

## Appendix A: Finished project structure

After Exercise 12 your workspace looks like this:

```
ai-impersonator-angular/
├── public/                          # copied to the web root as-is
│   ├── banner.jpg                   # chat page header image
│   ├── favicon.ico
│   ├── send.svg                     # chat send button
│   ├── x-close.svg                  # notification dismiss button
│   └── userlist.json                # in-memory user store
├── src/
│   ├── index.html
│   ├── main.ts                      # bootstrapApplication(AppComponent, appConfig)
│   ├── styles.css                   # global styles
│   ├── environments/
│   │   ├── environment.example.ts   # committed template
│   │   └── environment.ts           # gitignored — your real xAI key
│   └── app/
│       ├── app.component.*          # root — hosts header + router outlet
│       ├── app.config.ts            # providers: router, HttpClient
│       ├── app.routes.ts            # route definitions incl. guards
│       ├── auth.service.ts          # login, logout, roles
│       ├── auth.guard.ts            # functional route guard
│       ├── rest-client.service.ts   # xAI API calls
│       ├── header/                  # navbar, dynamic Login/Logout link
│       ├── chat/                    # home page — AI chat
│       ├── contact/                 # reactive form + validation
│       ├── login/                   # template-driven form
│       ├── dashboard/               # protected page, server load overview
│       ├── admin/                   # admin-role-only page
│       ├── traffic-light/           # reusable presentational component
│       └── notification/            # signal-based notifications
├── angular.json
├── package.json
└── tsconfig.json
```

## Appendix B: What you learned

| Exercise | Angular concept |
|---|---|
| 1 | Standalone bootstrap, `ApplicationConfig`, providers |
| 2 | Router configuration, wildcard routes |
| 3 | `routerLink`, component styles, flexbox layout |
| 4 | Template-driven binding (`[(ngModel)]`), `@ViewChild`, event handling |
| 5 | Services, dependency injection, `HttpClient`, RxJS `catchError` |
| 6 | Signals, `signal()` / `asReadonly()`, service-driven UI state |
| 7 | Reactive forms, `FormGroup` / `FormControl`, `Validators` |
| 8 | Stateful services, loading JSON assets at startup |
| 9 | Template-driven forms, programmatic navigation with `Router` |
| 10 | Functional route guards, `inject()`, route `data` for roles |
| 11 | Guarding routes, conditional templates with `@if` |
| 12 | `@Input()`, `@for` control flow, presentational components |

### Where to go next

- Move the xAI call behind a small backend so the API key never reaches the browser.
- Replace the in-memory `AuthService` with a real token-based login and an `HttpInterceptor`.
- Lazy-load the dashboard and admin routes with `loadComponent`.
- Convert the remaining components from `@Input()`/`@ViewChild` decorators to the signal-based
  `input()` / `viewChild()` functions.

# AI Impersonator — Angular

An Angular application that lets you chat with an AI impersonating any well-known person, powered by the [xAI Grok API](https://x.ai). Built as a learning project covering Angular fundamentals: routing, reactive and template-driven forms, signals, guards, and standalone components.

---

## Features

| Feature | Description |
|---|---|
| **AI Chat** | Ask questions and get answers as if from any famous person |
| **Contact Form** | Reactive form with full validation (required, email, min/max length) |
| **Authentication** | Login/logout with role-based access control |
| **Route Guards** | Functional `authGuard` protecting the dashboard and admin pages |
| **Notifications** | Signal-based notification system with auto-dismiss |
| **Dashboard** | Server load overview with a custom traffic light component |

---

## Tech Stack

- **Angular 22** (standalone components, new control flow syntax)
- **Node.js 26**
- **TypeScript 6**
- **xAI Grok API** (`grok-4` model)

---

## Project Structure

```
src/
├── app/
│   ├── app.component.*          # Root component — hosts header + router outlet
│   ├── app.config.ts            # Providers: router, HttpClient
│   ├── app.routes.ts            # Route definitions (with auth guards)
│   ├── auth.service.ts          # Login, logout, role management
│   ├── auth.guard.ts            # Functional route guard with role support
│   ├── rest-client.service.ts   # xAI API calls
│   ├── header/                  # Navbar with dynamic Login/Logout link
│   ├── chat/                    # Home page — AI chat interface
│   ├── contact/                 # Contact form (reactive forms)
│   ├── login/                   # Login form (template-driven forms)
│   ├── dashboard/               # Protected page with server load overview
│   ├── admin/                   # Admin-only page (role: admin)
│   ├── traffic-light/           # Reusable traffic light component
│   └── notification/            # Signal-based notification system
├── environments/
│   ├── environment.ts           # Gitignored — put your real API key here
│   └── environment.example.ts   # Committed template
└── public/
    └── userlist.json            # In-memory user store
```

---

## Getting Started

### Prerequisites

- Node.js 22+ (LTS) or 24+
- Angular CLI: `npm install -g @angular/cli`

### Installation

```bash
git clone <repo-url>
cd ai-impersonator-angular
npm install
```

### Configure the xAI API Key

Copy the environment template and add your key:

```bash
cp src/environments/environment.example.ts src/environments/environment.ts
```

Then edit `src/environments/environment.ts`:

```ts
export const environment = {
  xaiApiKey: 'your-xai-api-key-here',
};
```

`environment.ts` is listed in `.gitignore` and will never be committed.

### Run

```bash
ng serve
```

Open [http://localhost:4200](http://localhost:4200).

---

## Demo Credentials

The user list is loaded from `public/userlist.json` at startup.

| Username | Password | Role |
|---|---|---|
| `admin` | `verySecret` | admin |
| `user` | `verySecret` | user |
| `guest` | `verySecret` | guest |

- **Dashboard** — accessible to any authenticated user
- **Admin** — accessible to the `admin` role only
- **Guest** — sees an upgrade prompt on the dashboard

---

## Key Concepts in the Code

### Routing with Guards (`app.routes.ts`)

```ts
{ path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
{ path: 'admin', component: AdminComponent, canActivate: [authGuard], data: { role: 'admin' } },
```

### Signal-based Notifications (`notification.service.ts`)

```ts
private notifications = signal<NotificationMessage[]>([]);
notifications$ = this.notifications.asReadonly();
```

### Reactive Form with Validation (`contact.component.ts`)

```ts
contactForm = new FormGroup({
  nameControl:    new FormControl('', Validators.required),
  emailControl:   new FormControl('', [Validators.required, Validators.email]),
  messageControl: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]),
});
```

### New Angular Control Flow (`dashboard.component.html`)

```html
@for (serverload of serverLoads; track serverload.name) {
  <app-traffic-light [value]="serverload.value" [height]="50"></app-traffic-light>
}
```

---

## Workshop

A step-by-step workshop with exam-style questions is included in [`workshop.md`](./workshop.md). It is self-contained: **Part 0** covers the full environment setup (Node, Angular CLI, project creation, xAI API key, static assets, troubleshooting), so participants need nothing but that one file. It then guides you through rebuilding this application from scratch, with solutions hidden in collapsible detail blocks.

**Part 0 — Environment Setup**
0. Prerequisites, project creation, API key, assets

**Part 1 — Navbar, Home & Contact Form**
1. Bootstrap the app
2. Define routes
3. Create the Header / Navbar
4. Create the Chat (Home) component
5. Set up the REST client service
6. Build the Notification system
7. Build the Contact form

**Part 2 — Login, Auth Guard & Dashboard**

8. Create the AuthService
9. Create the Login component
10. Write a functional Auth Guard
11. Protect routes and add Login/Logout to the navbar
12. Build the Dashboard and Traffic Light component

---

## Build

```bash
ng build
```

Artifacts are written to `dist/`. The production build uses esbuild for fast, optimized output.

# Bank Interface — Autenticação Angular (JWT + OAuth2 Google)

Guia de implementação enterprise para autenticação centralizada no `shell-app`,
preparada para Micro Frontends e backend Java + Spring Security.

---

## 1. Visão geral do fluxo

```
┌──────────┐   1. login (email/senha ou Google)   ┌──────────────────┐
│  Browser │ ────────────────────────────────────▶ │ Spring (auth-svc)│
│  shell   │ ◀──── 2. {accessToken, user} ──────── │ + Spring Security│
└──────────┘   refresh token em cookie httpOnly   └──────────────────┘
     │
     │ 3. AuthService (singleton, shared-lib)
     │    armazena access em memória + user em store NgRx
     ▼
┌────────────────────────────────────────┐
│ Cada request HTTP → AuthInterceptor    │
│   adiciona  Authorization: Bearer ...  │
│   on 401   →  refresh  →  retry        │
└────────────────────────────────────────┘
```

**Princípios:**
- **Access token** curto (15 min) — em memória (não em `localStorage`).
- **Refresh token** longo (7–30 dias) — cookie `httpOnly + Secure + SameSite=Strict`.
- **Refresh rotativo** — backend invalida o anterior a cada uso.
- **Logout** = limpa store + chama `POST /auth/logout` (backend invalida refresh).
- **Persistência de sessão** = tentar `/auth/refresh` no bootstrap do app.

---

## 2. Stack & bibliotecas

| Necessidade | Biblioteca |
|---|---|
| Forms | `@angular/forms` (Reactive Forms) |
| UI | `@angular/material` + Tailwind |
| Validação | `zod` ou validators nativos + `ngx-zod-form` |
| Máscaras | `ngx-mask` |
| Toast | `ngx-sonner` ou MatSnackBar |
| Loading | Interceptor + `ngx-skeleton-loader` |
| Google Login | `@abacritt/angularx-social-login` **ou** Google Identity Services (GIS) puro |
| State | NgRx (`@ngrx/store`, `@ngrx/effects`) |
| JWT decode | `jwt-decode` |
| HTTP | `HttpClient` |

> **Recomendação:** use **GIS** direto (script `https://accounts.google.com/gsi/client`) — mais leve, oficial e atual. `angularx-social-login` ainda funciona, mas adiciona dependência.

---

## 3. Estrutura de pastas (auth)

```
libs/shared/auth/
├── src/lib/
│   ├── models/
│   │   ├── user.model.ts
│   │   ├── auth-tokens.model.ts
│   │   └── role.enum.ts
│   ├── services/
│   │   ├── auth.service.ts          # singleton — fonte da verdade
│   │   ├── token.service.ts         # access token em memória
│   │   └── google-auth.service.ts   # GIS wrapper
│   ├── interceptors/
│   │   ├── auth.interceptor.ts      # injeta Bearer + refresh on 401
│   │   └── csrf.interceptor.ts      # opcional
│   ├── guards/
│   │   ├── auth.guard.ts            # bloqueia rotas privadas
│   │   ├── role.guard.ts            # bloqueia por role
│   │   └── public.guard.ts          # impede logado acessar /login
│   ├── store/
│   │   ├── auth.actions.ts
│   │   ├── auth.reducer.ts
│   │   ├── auth.effects.ts
│   │   └── auth.selectors.ts
│   └── index.ts                     # barrel
└── README.md

apps/shell/src/app/
├── pages/
│   ├── login/
│   ├── signup/
│   ├── forgot-password/
│   ├── reset-password/
│   └── splash/                      # tela de boot enquanto valida sessão
├── layouts/
│   ├── auth-layout/                 # painel split: brand + form
│   └── main-layout/                 # sidebar + topbar (rotas protegidas)
└── app.routes.ts

environments/
├── environment.ts
└── environment.production.ts
```

---

## 4. Models / interfaces

```ts
// user.model.ts
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  roles: Role[];
  createdAt: string;
}

// role.enum.ts
export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  PREMIUM = 'PREMIUM',
}

// auth-tokens.model.ts
export interface AuthTokens {
  accessToken: string;
  expiresIn: number; // segundos
}

export interface AuthResponse {
  tokens: AuthTokens;
  user: User;
}

export interface LoginRequest  { email: string; password: string; }
export interface SignupRequest { name: string; email: string; password: string; }
export interface GoogleLoginRequest { idToken: string; }
```

---

## 5. AuthService (singleton)

```ts
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly store = inject(Store);
  private readonly api = environment.apiUrl;

  // Signal-based state (Angular 17+)
  readonly user = signal<User | null>(null);
  readonly isAuthenticated = computed(() => !!this.user());
  readonly hasRole = (role: Role) => computed(() => this.user()?.roles.includes(role) ?? false);

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/auth/login`, payload, { withCredentials: true })
      .pipe(tap(res => this.setSession(res)));
  }

  signup(payload: SignupRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/auth/signup`, payload, { withCredentials: true })
      .pipe(tap(res => this.setSession(res)));
  }

  loginWithGoogle(idToken: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/auth/google`, { idToken }, { withCredentials: true })
      .pipe(tap(res => this.setSession(res)));
  }

  refresh(): Observable<AuthTokens> {
    return this.http.post<AuthTokens>(`${this.api}/auth/refresh`, {}, { withCredentials: true })
      .pipe(tap(t => this.tokenService.set(t)));
  }

  forgotPassword(email: string) {
    return this.http.post(`${this.api}/auth/forgot-password`, { email });
  }

  resetPassword(token: string, password: string) {
    return this.http.post(`${this.api}/auth/reset-password`, { token, password });
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.api}/auth/logout`, {}, { withCredentials: true })
      .pipe(finalize(() => this.clearSession()));
  }

  /** chamado no bootstrap (APP_INITIALIZER) */
  bootstrap(): Observable<User | null> {
    return this.refresh().pipe(
      switchMap(() => this.http.get<User>(`${this.api}/auth/me`)),
      tap(user => this.user.set(user)),
      catchError(() => of(null)),
    );
  }

  private setSession(res: AuthResponse) {
    this.tokenService.set(res.tokens);
    this.user.set(res.user);
    this.store.dispatch(AuthActions.loginSuccess({ user: res.user }));
  }

  private clearSession() {
    this.tokenService.clear();
    this.user.set(null);
    this.store.dispatch(AuthActions.logout());
  }

  constructor(private tokenService: TokenService) {}
}
```

### TokenService (memória, não localStorage)

```ts
@Injectable({ providedIn: 'root' })
export class TokenService {
  private accessToken: string | null = null;
  private expiresAt = 0;

  set(t: AuthTokens) {
    this.accessToken = t.accessToken;
    this.expiresAt = Date.now() + t.expiresIn * 1000;
  }
  get() { return this.accessToken; }
  isExpired() { return Date.now() >= this.expiresAt - 30_000; } // margem 30s
  clear() { this.accessToken = null; this.expiresAt = 0; }
}
```

> **Por que memória?** Defesa contra XSS roubando o token. O refresh em cookie
> `httpOnly` não é acessível via JS — é a postura mais segura para SPAs.

---

## 6. AuthInterceptor (Bearer + refresh on 401)

```ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenSvc = inject(TokenService);
  const auth = inject(AuthService);

  // skip endpoints públicos
  if (req.url.includes('/auth/login') || req.url.includes('/auth/refresh')) {
    return next(req);
  }

  const token = tokenSvc.get();
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status !== 401) return throwError(() => err);
      return auth.refresh().pipe(
        switchMap(() => {
          const retried = req.clone({
            setHeaders: { Authorization: `Bearer ${tokenSvc.get()}` },
          });
          return next(retried);
        }),
        catchError(refreshErr => {
          auth.logout().subscribe();
          return throwError(() => refreshErr);
        }),
      );
    }),
  );
};
```

> Para múltiplas chamadas concorrentes recebendo 401 ao mesmo tempo,
> use um `BehaviorSubject<boolean>` no `AuthService` para enfileirar
> requests durante o refresh em andamento.

---

## 7. Guards

```ts
// auth.guard.ts
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isAuthenticated()) return true;
  router.navigate(['/login']);
  return false;
};

// role.guard.ts
export const roleGuard = (roles: Role[]): CanActivateFn => () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const user = auth.user();
  if (user && roles.some(r => user.roles.includes(r))) return true;
  router.navigate(['/forbidden']);
  return false;
};

// public.guard.ts — impede logado acessar /login
export const publicGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.isAuthenticated()) return true;
  router.navigate(['/']);
  return false;
};
```

---

## 8. Bootstrap (APP_INITIALIZER) — splash + persistência

```ts
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideStore({ auth: authReducer }),
    provideEffects(AuthEffects),
    {
      provide: APP_INITIALIZER,
      useFactory: (auth: AuthService) => () => firstValueFrom(auth.bootstrap()),
      deps: [AuthService],
      multi: true,
    },
  ],
};
```

A `SplashScreen` mostra logo + spinner enquanto o `bootstrap()` resolve.

---

## 9. Rotas com layouts

```ts
export const routes: Routes = [
  {
    path: '',
    canActivate: [publicGuard],
    component: AuthLayoutComponent,
    children: [
      { path: 'login',           loadComponent: () => import('./pages/login/login.component') },
      { path: 'signup',          loadComponent: () => import('./pages/signup/signup.component') },
      { path: 'forgot-password', loadComponent: () => import('./pages/forgot-password/forgot-password.component') },
      { path: 'reset-password',  loadComponent: () => import('./pages/reset-password/reset-password.component') },
    ],
  },
  {
    path: '',
    canActivate: [authGuard],
    component: MainLayoutComponent,
    children: [
      { path: '',          loadChildren: () => import('bank/Routes').then(m => m.routes) },
      { path: 'schedule',  loadChildren: () => loadRemoteModule({ remoteName: 'schedule', exposedModule: './Routes' }) },
      { path: 'expenses',  loadChildren: () => loadRemoteModule({ remoteName: 'expense-control', exposedModule: './Routes' }),
        canActivate: [roleGuard([Role.USER, Role.PREMIUM])] },
      { path: 'card',      loadChildren: () => loadRemoteModule({ remoteName: 'credit-card', exposedModule: './Routes' }) },
      { path: 'export',    loadChildren: () => loadRemoteModule({ remoteName: 'export', exposedModule: './Routes' }) },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
```

---

## 10. Login com Google (GIS)

### 10.1 Frontend

`index.html`:
```html
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

`google-auth.service.ts`:
```ts
declare const google: any;

@Injectable({ providedIn: 'root' })
export class GoogleAuthService {
  private readonly auth = inject(AuthService);
  private readonly clientId = environment.googleClientId;

  init(buttonEl: HTMLElement) {
    google.accounts.id.initialize({
      client_id: this.clientId,
      callback: (resp: { credential: string }) =>
        this.auth.loginWithGoogle(resp.credential).subscribe(),
      auto_select: false,
      ux_mode: 'popup',
    });
    google.accounts.id.renderButton(buttonEl, {
      theme: 'outline', size: 'large', shape: 'pill', text: 'continue_with',
    });
  }
}
```

### 10.2 Backend (Spring Boot — esboço)

```java
@PostMapping("/auth/google")
public AuthResponse google(@RequestBody GoogleLoginRequest req) {
    GoogleIdToken token = verifier.verify(req.idToken());     // google-api-client
    GoogleIdToken.Payload p = token.getPayload();
    User user = userService.upsertFromGoogle(p.getEmail(), (String) p.get("name"), (String) p.get("picture"));
    return tokenService.issue(user, response); // seta cookie httpOnly do refresh
}
```

> O `idToken` enviado é JWT assinado pelo Google. O Spring **valida assinatura** com as chaves públicas do Google (cacheadas), confere `aud == clientId`, e só então cria/atualiza o usuário e emite seus próprios tokens.

---

## 11. Integração com Spring Security (resumo)

- **Endpoints**:
  - `POST /auth/login` (email/senha) → 200 + JSON + `Set-Cookie: refresh_token=...; HttpOnly; Secure; SameSite=Strict; Path=/auth`
  - `POST /auth/signup`
  - `POST /auth/google`
  - `POST /auth/refresh` (lê cookie, rotaciona, devolve novo access)
  - `POST /auth/logout` (invalida refresh server-side + apaga cookie)
  - `GET  /auth/me`
  - `POST /auth/forgot-password` / `POST /auth/reset-password`
- **Spring Security** com `OAuth2ResourceServer` decodificando JWT (HS256 ou RS256).
- **CORS**: `allowedOrigins` = URL do shell, `allowCredentials = true` (necessário para cookie).
- **CSRF**: como o refresh é cookie, habilite CSRF token para endpoints de mutação **ou** mantenha `SameSite=Strict` + double-submit pattern.

---

## 12. Roles & permissões

- Backend coloca `roles` no claim do JWT.
- Frontend lê via `jwt-decode` (apenas para UX — nunca confie no client para autorização real).
- `roleGuard([Role.ADMIN])` em rotas; diretiva `*hasRole="'ADMIN'"` em UI.

```ts
@Directive({ selector: '[hasRole]', standalone: true })
export class HasRoleDirective {
  private vcr = inject(ViewContainerRef);
  private tpl = inject(TemplateRef);
  private auth = inject(AuthService);
  @Input() set hasRole(role: Role) {
    this.vcr.clear();
    if (this.auth.user()?.roles.includes(role)) this.vcr.createEmbeddedView(this.tpl);
  }
}
```

---

## 13. Centralização no shell (MFE)

- `AuthService`, `TokenService`, `authInterceptor`, `authGuard` ficam em
  `libs/shared/auth` e são expostos como **singleton** pelo Native Federation:

```ts
// federation.config.ts (shell e remotes)
shared: {
  '@angular/core':   { singleton: true, strictVersion: true },
  '@angular/common': { singleton: true, strictVersion: true },
  '@angular/router': { singleton: true, strictVersion: true },
  '@bank/shared-auth': { singleton: true, strictVersion: true },
  '@ngrx/store':     { singleton: true, strictVersion: true },
}
```

- Remotes **não** têm tela de login. Ao acessar uma rota remota sem sessão,
  o `authGuard` do shell redireciona para `/login` antes do remote carregar.

---

## 14. UX — boas práticas fintech

- Tela split: painel lateral com brand + benefícios; formulário à direita.
- **Loading state** no botão (spinner + texto "Entrando...").
- **Erros amigáveis** mapeados (não vaze stack do backend).
- **Strength meter** na senha (4 níveis).
- **Toggle mostrar senha**.
- **Magic link** ou **passkey** como evolução.
- **2FA TOTP** opcional (campo de 6 dígitos pós-login).
- **Lock screen** após N tentativas (server-side; UI mostra contador).
- **"Manter conectado"** controla apenas duração do refresh (server emite refresh longo ou curto).
- **Splash screen** com skeleton enquanto `bootstrap()` resolve — evita flash de `/login` em sessão válida.
- **Acessibilidade**: labels associados, foco visível, `aria-invalid`, anúncio de erros via `aria-live`.

---

## 15. Roadmap de implementação

1. `libs/shared/auth` com models, TokenService, AuthService stub.
2. Tela de login (Reactive Form + validação + loading + erro).
3. `authInterceptor` + `authGuard` + `publicGuard`.
4. `APP_INITIALIZER` chamando `bootstrap()` + SplashScreen.
5. Tela de signup + força de senha.
6. Forgot password + reset password (`/reset-password?token=...`).
7. Google Login (GIS).
8. Logout (botão no topbar + limpeza de store).
9. Roles + `HasRoleDirective` + `roleGuard`.
10. Refresh token rotativo + fila de requests durante refresh.
11. 2FA opcional.
12. Testes: unit (AuthService, interceptor) + e2e (Playwright: login, signup, refresh, logout).

---

## 16. Variáveis de ambiente

```ts
// environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  googleClientId: '....apps.googleusercontent.com',
  refreshSkewSeconds: 30,
  remotes: {
    bank: 'http://localhost:4201/remoteEntry.json',
    schedule: 'http://localhost:4202/remoteEntry.json',
    expenseControl: 'http://localhost:4203/remoteEntry.json',
    creditCard: 'http://localhost:4204/remoteEntry.json',
    export: 'http://localhost:4205/remoteEntry.json',
  },
};
```

---

## 17. Checklist de segurança (antes de ir para produção)

- [ ] Refresh token em cookie `HttpOnly + Secure + SameSite=Strict`.
- [ ] Access token apenas em memória (nunca `localStorage`).
- [ ] HTTPS obrigatório (HSTS).
- [ ] CORS com `allowedOrigins` específico + `allowCredentials`.
- [ ] CSP restritiva (script-src self + accounts.google.com).
- [ ] Rate limit no `/auth/login` e `/auth/forgot-password` (backend).
- [ ] Bcrypt cost ≥ 12 no Spring.
- [ ] Validação client + server (zod no front, Bean Validation no back).
- [ ] Sanitização de mensagens de erro (sem stack trace para o cliente).
- [ ] Logs de auditoria de login/logout no backend.
- [ ] Sentry para erros do frontend.

---

**Resumo:** centralize a autenticação na `shared-auth` lib do shell, use access em
memória + refresh em cookie httpOnly, integre Google via GIS enviando o `idToken`
para o Spring validar, e proteja rotas com `authGuard` + `roleGuard`. Esse setup
é o padrão atual de fintechs sérias e impressiona em portfólio.

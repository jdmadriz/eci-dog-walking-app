import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastComponent } from './shared/components/toast/toast';
import { AuthActions } from './state/auth/auth.actions';
import { selectIsAuthenticated, selectUser } from './state/auth/auth.selectors';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private store = inject(Store);

  protected readonly title = signal('dog-walking-app');
  mobileMenuOpen = signal(false);

  isAuthenticated = this.store.selectSignal(selectIsAuthenticated);
  user = this.store.selectSignal(selectUser);

  ngOnInit() {
    this.store.dispatch(AuthActions.checkAuth());
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }
}

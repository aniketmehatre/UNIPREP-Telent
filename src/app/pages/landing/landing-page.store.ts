import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';

interface HeaderLogoState {
  logoUrl: string;
}

@Injectable({ providedIn: 'root' })
export class HeaderLogoStore extends ComponentStore<HeaderLogoState> {
  readonly logoUrl$ = this.select((state) => state.logoUrl);

  constructor() {
    super({ logoUrl: '/uniprep-assets/images/uniprep-dark.png' });
  }

  setLogo(url: string) {
    this.setState({ logoUrl: url });
  }

  resetLogo() {
    this.setState({ logoUrl: '/uniprep-assets/images/uniprep-dark.png' });
  }
}

import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../theme.service';

@Component({
  selector: 'uni-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  isDarkMode: boolean;
  displaytandc!: boolean;
  displayprivacypolicy!: boolean;

  showTandC() {
    this.displaytandc = true;
  }
  
  showprivacypolicy() {
    this.displayprivacypolicy = true;
  }

  constructor(private themeService: ThemeService) {
    // Initialize the isDarkMode property with the value from the service
    this.isDarkMode = this.themeService.getInitialSwitchState();
  }

  scrollToSection(event: Event, sectionId: string): void {
    // Prevent the default anchor link behavior
    event.preventDefault();

    // Find the element with the given section ID
    const section = document.querySelector(`#${sectionId}`);

    // If the section exists, scroll to it smoothly
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }

  ngOnInit() {
    // Any additional initialization can go here
  }

  toggleTheme() {
    this.themeService.toggleTheme();
    // After toggling, update the isDarkMode property to reflect the new state
    this.isDarkMode = this.themeService.isDarkMode();
  }
}

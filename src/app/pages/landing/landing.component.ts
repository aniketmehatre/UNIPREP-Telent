import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'uni-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, OnDestroy {
  countries: any;
  darkModeSwitch!: HTMLInputElement;
  videoUrl = "../../../uniprep-assets/video/uniprepvideo.mp4";
  constructor() { }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

    private setCookie(name: string, value: string, days: number = 365) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
  }

  private getCookie(name: string) {
    const cookieValue = document.cookie.match(
      `(^|;)\\s*${name}\\s*=\\s*([^;]+)`
    );
    return cookieValue ? cookieValue.pop() : "";
  }


  ngOnInit(): void {

     this.countries = [
      {name: 'USA', flag: 'path_to_usa_flag'},
      {name: 'Canada', flag: 'path_to_canada_flag'},
    ];

    this.darkModeSwitch = document.getElementById(
      "darkmodeswitch"
    ) as HTMLInputElement;

    // Read the theme and checked state from the cookie and apply them to the body class and the switch
    const theme = this.getCookie("theme");
    if (theme === "dark") {
      document.body.classList.add("darkmode");
      this.darkModeSwitch.checked = true;
    } else {
      document.body.classList.add("lightmode");
      this.darkModeSwitch.checked = false;
    }

    const checked = this.getCookie("checked");
    if (checked === "true") {
      this.darkModeSwitch.checked = true;
    } else if (checked === "false") {
      this.darkModeSwitch.checked = false;
    }

    // Add event listener to toggle the theme and save it in a cookie
    this.darkModeSwitch.addEventListener("change", () => {
      if (this.darkModeSwitch.checked) {
        document.body.classList.remove("lightmode");
        document.body.classList.add("darkmode");
        this.setCookie("theme", "dark");
        this.setCookie("checked", "true");
      } else {
        document.body.classList.remove("darkmode");
        document.body.classList.add("lightmode");
        this.setCookie("theme", "light");
        this.setCookie("checked", "false");
      }
    });

    

  }
}
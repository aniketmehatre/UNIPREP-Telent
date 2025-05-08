import { CommonModule } from "@angular/common"
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
} from "@angular/core"
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms"
import { Router, RouterModule } from "@angular/router"
import { environment } from "@env/environment"
import { LocalStorageService } from "ngx-localstorage"
import { MessageService } from "primeng/api"
import { FluidModule } from "primeng/fluid"
import { InputGroupModule } from "primeng/inputgroup"
import { InputGroupAddonModule } from "primeng/inputgroupaddon"
import { InputIconModule } from "primeng/inputicon"
import { InputTextModule } from "primeng/inputtext"
import { PasswordModule } from "primeng/password"
import { AuthTokenService } from "src/app/core/services/auth-token.service"
import { DataService } from "src/app/data.service"
import { SubSink } from "subsink"
import { LocationService } from "../../location.service"
import { AuthService } from "../auth.service"
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'uni-co-branded',
  templateUrl: './co-branded.component.html',
  styleUrl: './co-branded.component.scss',
  imports: [CommonModule, FluidModule, PasswordModule, RouterModule, InputTextModule, InputIconModule,
    InputGroupModule, InputGroupAddonModule, FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoBrandedComponent implements OnInit, OnDestroy {
  @ViewChild("button2") button2!: ElementRef
  private subs = new SubSink()
  loginForm: FormGroup
  submitted: boolean = false
  show: boolean = true
  password: string = "password"
  isLoading: boolean = false
  isDisabled: boolean = false
  locationData: any
  imageUrlWhitelabel: string | null = null
  domainname: string = 'main'
  domainNameCondition: string
  ipURL: string = "https://api.ipify.org?format=json"
  constructor(private service: AuthService, private formBuilder: FormBuilder, private route: Router,
    private toast: MessageService, private dataService: DataService,
    private locationService: LocationService,
    private storage: LocalStorageService, private authTokenService: AuthTokenService,
    private cdr: ChangeDetectorRef, private el: ElementRef, private renderer: Renderer2) { }

  ngOnDestroy() {
    this.subs.unsubscribe()
  }

  ngOnInit() {
    this.initializeComponent()
  }

  private initializeComponent() {
    this.domainNameCondition = window.location.hostname
    this.domainname = this.isDomainMain() ? 'main' : 'sub'
    this.dataService.loggedInAnotherDevice("none")
    fetch(this.ipURL)
      .then((response) => response.json())
      .then((data) => {
        this.locationData = data
      })
    this.locationService.getImage().subscribe((imageUrl) => {
      this.imageUrlWhitelabel = imageUrl
      this.cdr.markForCheck()
    })
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
      domain_type: ['main']
    })
    this.loginForm.patchValue({ domain_type: this.domainname })
  }

  private isDomainMain(): boolean {
    return this.domainNameCondition === "dev-student.uniprep.ai" ||
      this.domainNameCondition === "*.uniprep.ai" ||
      this.domainNameCondition === "uniprep.ai"
  }

  navigateTo(type: string) {
    if (type === 'login') {
      this.route.navigate(['/students/login']);
    } else if (type === 'employer') {
      // window.location.href = '/institute/';
      this.route.navigate(['/institute/auth/login']);
    }
  }


  countryLists: any
  loadCountryList(data: any) {
    this.locationService.getCountry().subscribe((countryList) => {
      const selectedCountry = countryList.find((element: any) =>
        element.id === Number(data.userdetails[0].selected_country)
      )

      if (selectedCountry) {
        this.storage.set("countryId", selectedCountry.id.toString())
        this.dataService.changeCountryName(selectedCountry.country)
        this.dataService.changeCountryFlag(selectedCountry.flag)
        this.dataService.changeCountryId(selectedCountry.id)
      }
    })
  }

  get f() {
    return this.loginForm.controls
  }

}

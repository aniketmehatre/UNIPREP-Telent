import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { landingServices } from '../landing.service';
import { MessageService } from 'primeng/api';
import { CountryISO, NgxIntlTelInputModule, SearchCountryField } from "ngx-intl-tel-input"

interface Office {
  name: string;
  address: string;
  phone: string;
  phoneCode: string;
  flagIcon: string;
  mapUrl: string;
}
@Component({
  selector: 'uni-contact-us',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    NgxIntlTelInputModule
  ],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})
export class ContactUsComponent {
  contactForm: FormGroup;
  selectedHeadquarter: string = 'United Kingdom';
  selectedOffice!: Office;
  SearchCountryField = SearchCountryField
  CountryISO = CountryISO
  preferredCountry: any
  preferredCountries: CountryISO[] = [CountryISO.India, CountryISO.UnitedKingdom];
  phoneNumberConfig = {
    preferredCountries: [CountryISO.India],
    enablePlaceholder: true,
    searchCountryFlag: true,
    searchCountryField: [SearchCountryField.Iso2, SearchCountryField.Name],
    selectedCountryISO: CountryISO.India,
  }

  offices: Office[] = [
    {
      name: 'United Kingdom',
      address: '128 City Road, London, United Kingdom, EC1V 2NX',
      phone: '+44 9900900990',
      phoneCode: '+44',
      flagIcon: 'uniprep-assets/icons/united-kingdom.png',
      mapUrl: 'uniprep-assets/images/location-maps/uk.png'
    },
    {
      name: 'Indian Office',
      address: '728, 2nd Floor, Thanishka Tower, 1st Main Rd, Yelahanka New Town, Bengaluru, Karnataka 560064',
      phone: '+91 99807 88380',
      phoneCode: '+91',
      flagIcon: 'uniprep-assets/icons/india.png',
      mapUrl: 'uniprep-assets/images/location-maps/india.png'
    }
  ];

  inquiryTypes: string[] = [
    'General Inquiry',
    'Support',
    'Partnership',
    'Career',
    'Other'
  ];

  countryCodes: { code: string, name: string }[] = [
    { code: '+91', name: 'IND +91' },
    { code: '+44', name: 'UK +44' },
    { code: '+1', name: 'USA +1' },
    // Add more country codes as needed
  ];

  selectedCountryCode: string = '+91';

  constructor(private fb: FormBuilder, private landingPageServices: landingServices, private messageService: MessageService) { }

  async ngOnInit() {
    this.initForm();
    this.selectedOffice = this.offices[0];
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      this.preferredCountry = data.country_code?.toLowerCase();
    } catch (error) {
      console.warn('Error fetching location data:', error);
      this.preferredCountry = 'in'; // Default to India
    }
  }

  initForm(): void {
    this.contactForm = this.fb.group({
      firstName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
      enquireType: ['', Validators.required],
      organization: [''],
      location: ['', Validators.required],
      helpMessage: ['', Validators.required]
    });
  }

  onHeadquarterChange(office: string): void {
    this.selectedHeadquarter = office;
    const officeData = this.offices.find((item) => item.name == office);
    if (officeData) {
      this.selectedOffice = officeData;
    }

  }

  onCountryCodeChange(code: string): void {
    this.selectedCountryCode = code;
    this.contactForm.patchValue({
      countryCode: code
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.landingPageServices.sendContactUsPage({ ...this.contactForm.value, phoneNumber: this.cf?.['phoneNumber'].value.number, phoneCountryCode: this.cf?.['phoneNumber'].value.dialCode }).subscribe({
        next: response => {
          console.log(response);

          if (response.success) {
            this.messageService.add({
              severity: 'success',
              summary: 'Submitted',
              detail: response.message
            });
            this.contactForm.reset();
          }
        },
        error: error => {
          console.log(error.error.message);
        }
      })
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key)?.markAsTouched();
      });
    }
  }

  get cf() {
    return this.contactForm.controls;
  }

  changeLocation(location: string): void {
    this.selectedHeadquarter = location
  }

  sendEmail(): void {
    window.location.href = 'mailto:info@uniprep.ai';
  }
}

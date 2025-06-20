import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { CountryISO, NgxIntlTelInputModule, SearchCountryField } from "ngx-intl-tel-input"
import { SafePipe } from "../../../pipes/safe.pipe";
import { SelectModule } from 'primeng/select';
import { RouterModule } from '@angular/router';
import { landingServices } from '../landing.service';

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
    NgxIntlTelInputModule,
    SafePipe,
    SelectModule,
    RouterModule
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
  preferredCountry: any;
  locationsList: { id: number, city_state: string }[] = [];
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
      phone: '+44 7864 716295',
      phoneCode: '+44',
      flagIcon: 'uniprep-assets/icons/united-kingdom.png',
      mapUrl: `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2482.2334321935673!2d-0.091397823871224!3d51.527278209251634!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761ca671d5df0b%3A0x368e18d29207f698!2s128%20City%20Rd%2C%20London%20EC1V%202NX%2C%20UK!5e0!3m2!1sen!2sin!4v1746784936807!5m2!1sen!2sin`
    },
    {
      name: 'Indian Office',
      address: '728, 2nd Floor, Thanishka Tower, 1st Main Rd, Yelahanka New Town, Bengaluru, Karnataka 560064',
      phone: '+91 63627 16586',
      phoneCode: '+91',
      flagIcon: 'uniprep-assets/icons/india.png',
      mapUrl: `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4649.99803408612!2d77.57438717575691!3d13.101634412012695!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae19e9105df037%3A0xa5e0ffbc37ee37a8!2sUNIABROAD%20-Bengaluru%20North%20%7C%20Study%20Abroad%20Experts!5e1!3m2!1sen!2sin!4v1750425313862!5m2!1sen!2sin`
    }
  ];

  inquiryTypes: string[] = [
    'General Inquiry',
    'Indian Institute',
    'International University',
    'Talent',
    'Employer',
    'Partner'
  ];

  selectedCountryCode: string = '+91';

  constructor(private fb: FormBuilder, private landingPageServices: landingServices, private messageService: MessageService) { }

  async ngOnInit() {
    this.initForm();
    this.selectedOffice = this.offices[0];
    this.getCitiesCountry('');
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
      organization: ['', Validators.required],
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

  getCitiesCountry(search: string) {
    this.landingPageServices.getCitiesCountry({ search: search }).subscribe({
      next: response => {
        this.locationsList = response;
      },
      error: error => {
        console.error(error.error.message);
      }
    })
  }

  onSubmit() {
    if (this.contactForm.valid) {
      if (this.isValidationPhoneNumber) {
        this.messageService.add({
          severity: 'error',
          summary: 'Required',
          detail: 'Please fill whatsapp number'
        });
      }
      let parms: any ={
        ...this.contactForm.value, 
        phoneNumber: this.cf?.['phoneNumber'].value.number, 
        phoneCountryCode: this.cf?.['phoneNumber'].value.dialCode
      }
      this.landingPageServices.sendContactUsPage(parms).subscribe({
        next: response => {
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
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: "Please fill add required fields."
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
    // window.location.href = 'mailto:info@uniprep.ai';
    // window.open('mailto:info@uniprep.ai', '_blank');
  }

  get isValidationPhoneNumber() {
    if (this.cf?.['phoneNumber']?.value?.dialCode && this.cf?.['phoneNumber']?.value?.number) {
      return false;
    }
    return true;
  }
}

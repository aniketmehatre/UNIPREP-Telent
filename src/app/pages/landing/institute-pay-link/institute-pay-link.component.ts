import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { landingServices } from '../landing.service';
import { CountryISO, NgxIntlTelInputModule, SearchCountryField } from 'ngx-intl-tel-input';
import { environment } from "@env/environment.prod";
import { WindowRefService } from '../../subscription/window-ref.service';

@Component({
  selector: 'uni-institute-pay-link',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, SelectModule, NgxIntlTelInputModule],
  templateUrl: './institute-pay-link.component.html',
  styleUrl: './institute-pay-link.component.scss'
})
export class InstitutePayLinkComponent {
  form: FormGroup;
  locationsList: { id: number; city_state: string }[] = [];
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  preferredCountry: any = CountryISO.India;

  // Sponsor type options similar to Employer
  sponsorTypeOptions: { label: string; value: string }[] = [
    { label: 'Title Sponsor', value: 'title' },
    { label: 'Platinum Sponsor', value: 'platinum' },
    { label: 'Gold Sponsor', value: 'gold' },
    { label: 'Silver Sponsor', value: 'silver' },
    { label: 'Bronze Sponsor', value: 'bronze' },
    { label: 'Custom Amount', value: 'custom' },
  ];

  private amountMap: Record<string, number> = {
    'title': 500000,
    'platinum': 300000,
    'gold': 100000,
    'silver': 50000,
    'bronze': 25000,
  };

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private landingPageServices: landingServices,
    private winRef: WindowRefService,
  ) {
    this.form = this.fb.group({
      user_name: ['', Validators.required],
      company_name: ['', Validators.required], // Labeled as Institution Name in UI
      designation: ['', Validators.required],
      location: ['', Validators.required],
      phone_number: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      sponsor_type: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]],
    });

    this.form.get('sponsor_type')!.valueChanges.subscribe((value) => {
      if (value === 'custom') {
        this.form.get('amount')!.setValue(0, { emitEvent: false });
        this.form.get('amount')!.enable({ emitEvent: false });
      } else {
        const amt = this.amountMap[value] ?? 0;
        this.form.get('amount')!.setValue(amt, { emitEvent: false });
        this.form.get('amount')!.disable({ emitEvent: false });
      }
    });

    const initVal = this.form.get('sponsor_type')!.value;
    if (initVal !== 'custom') {
      this.form.get('amount')!.disable({ emitEvent: false });
    }
  }

  async ngOnInit(): Promise<void> {
    this.getCitiesCountry('');
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      this.preferredCountry = (data.country_code?.toLowerCase()) || 'in';
    } catch (error) {
      console.warn('Error fetching location data:', error);
      this.preferredCountry = 'in';
    }
  }

  getCitiesCountry(search: string) {
    this.landingPageServices.getCitiesCountry({ search: search }).subscribe({
      next: (response) => {
        this.locationsList = response;
      },
      error: (error) => {
        console.error(error?.error?.message || 'Failed to fetch locations');
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach(c => c.markAsTouched());
      this.messageService.add({ severity: 'error', summary: 'Invalid', detail: 'Please fill all required fields.' });
      return;
    }

    const phoneObj = this.form?.get('phone_number')?.value;
    if (!phoneObj?.dialCode || !phoneObj?.number) {
      this.messageService.add({ severity: 'error', summary: 'Required', detail: 'Please provide a valid phone number with country code.' });
      return;
    }

    const payload = {
      ...this.form.getRawValue(),
      phone_number: phoneObj.number,
      phoneNumber: phoneObj.number,
      phoneCountryCode: phoneObj.dialCode,
      phoneCountryIso2: phoneObj.countryCode,
      phoneE164: phoneObj.e164Number,
      payment_method: 'RazorPay'
    };

    this.landingPageServices.institutePaymentLink(payload).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.payWithRazorPay(response.orderid);
          this.form.reset();
          this.messageService.add({ severity: 'success', summary: 'Submitted', detail: 'Institute details captured.' });
        }
      },
      error: error => {
        console.log(error.error.message);
      }
    });
  }

  payWithRazorPay(orderid: any) {
    let razorKey = "rzp_live_YErYQVqDIrZn1D";
    if (environment.domain == "api.uniprep.ai") {
      razorKey = "rzp_test_Crpr7YkjPaCLEr";
    }
    let phone = this.form?.get('phone_number')?.value.number;
    const options: any = {
      key: razorKey,
      amount: this.form?.get('amount')?.value * 100,
      currency: "INR",
      name: "UNIPREP",
      description: "UNIPREP Subscription",
      image: "https://uniprep.ai/uniprep-assets/images/icon-light.svg",
      order_id: orderid,
      prefill: {
        name: this.form?.get('user_name')?.value,
        email: this.form?.get('email')?.value,
        contact: phone === null || phone === "" ? "9876543210" : phone,
      },
      notes: {
        address: "165/1,Opp Brahmasthana Kalyana Mantapa Sahukar Chenniah Road, TK Layout, Mysuru - 570023 ",
      },
      modal: { escape: false },
      theme: { color: "var(--p-primary-500)" },
    };

    options.handler = (response: any, error: any) => {
      console.log(response);
      options.response = response;
      const paymentdata = {
        razorpay_order_id: response?.razorpay_order_id,
        razorpay_payment_id: response?.razorpay_payment_id
      };
      this.landingPageServices.instituteCompleteTransaction(paymentdata).subscribe({
        next: data => {
          this.messageService.add({ severity: "success", summary: "Success", detail: 'You will receive invoice in mail' });
        },
        error: err => {
          console.log(err?.error?.message);
          this.messageService.add({ severity: "error", summary: "Error", detail: err?.error?.message });
        }
      });
    };
    options.modal.ondismiss = () => {
      console.log('Transaction cancelled');
      this.messageService.add({ severity: "error", summary: "Error", detail: "Transaction cancelled" });
    };
    const rzp = new this.winRef.nativeWindow.Razorpay(options);
    rzp.open();
  }
}

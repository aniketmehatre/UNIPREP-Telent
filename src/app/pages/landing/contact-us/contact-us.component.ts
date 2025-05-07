import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';

@Component({
  selector: 'uni-contact-us',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
  ],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})
export class ContactUsComponent {
  activeFormType: string = 'general';
  contactForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    // Create base form with common fields
    const baseForm = {
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      helpMessage: ['', Validators.required]
    };

    if (this.activeFormType === 'general') {
      this.contactForm = this.fb.group({
        ...baseForm,
        phoneNumber: ['', Validators.required],
        organization: [''],
        country: ['', Validators.required]
      });
    } else if (this.activeFormType === 'indian') {
      this.contactForm = this.fb.group({
        ...baseForm,
        designation: ['', Validators.required],
        mobileNumber: [''],
        institutionName: ['', Validators.required],
        institutionNameFull: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        country: ['', Validators.required]
      });
    } else if (this.activeFormType === 'international') {
      this.contactForm = this.fb.group({
        ...baseForm,
        phoneNumber: ['', Validators.required],
        universityName: ['', Validators.required],
        country: ['', Validators.required]
      });
    }
  }

  changeFormType(formType: string) {
    this.activeFormType = formType;
    this.initForm();
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log('Form submitted:', this.contactForm.value);
      // Here you would typically send the form data to your backend
      this.contactForm.reset();
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key)?.markAsTouched();
      });
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }

  sendEmail() {
    window.location.href = 'mailto:contact@example.com';
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../Auth/auth.service";
import { LocationService } from "../../location.service";
import { MessageService } from "primeng/api";
import { User } from "../../@Models/user.model";
import { UserManagementService } from "./user-management.service";
import { SubSink } from "subsink";
import {Router} from "@angular/router";

@Component({
    selector: 'uni-user-management',
    templateUrl: './user-management.component.html',
    styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit {
    user!: User | null;
    // countryList = [
    //     {name: "Select", code: ""},
    //     {name: "Afghanistan", code: "AF"},
    //     {name: "land Islands", code: "AX"},
    //     {name: "Albania", code: "AL"},
    //     {name: "Algeria", code: "DZ"},
    //     {name: "American Samoa", code: "AS"},
    //     {name: "AndorrA", code: "AD"},
    //     {name: "Angola", code: "AO"},
    //     {name: "Anguilla", code: "AI"},
    //     {name: "Antarctica", code: "AQ"},
    //     {name: "Antigua and Barbuda", code: "AG"},
    //     {name: "Argentina", code: "AR"},
    //     {name: "Armenia", code: "AM"},
    //     {name: "Aruba", code: "AW"},
    //     {name: "Australia", code: "AU"},
    //     {name: "Austria", code: "AT"},
    //     {name: "Azerbaijan", code: "AZ"},
    //     {name: "Bahamas", code: "BS"},
    //     {name: "Bahrain", code: "BH"},
    //     {name: "Bangladesh", code: "BD"},
    //     {name: "Barbados", code: "BB"},
    //     {name: "Belarus", code: "BY"},
    //     {name: "Belgium", code: "BE"},
    //     {name: "Belize", code: "BZ"},
    //     {name: "Benin", code: "BJ"},
    //     {name: "Bermuda", code: "BM"},
    //     {name: "Bhutan", code: "BT"},
    //     {name: "Bolivia", code: "BO"},
    //     {name: "Bosnia and Herzegovina", code: "BA"},
    //     {name: "Botswana", code: "BW"},
    //     {name: "Bouvet Island", code: "BV"},
    //     {name: "Brazil", code: "BR"},
    //     {name: "British Indian Ocean Territory", code: "IO"},
    //     {name: "Brunei Darussalam", code: "BN"},
    //     {name: "Bulgaria", code: "BG"},
    //     {name: "Burkina Faso", code: "BF"},
    //     {name: "Burundi", code: "BI"},
    //     {name: "Cambodia", code: "KH"},
    //     {name: "Cameroon", code: "CM"},
    //     {name: "Canada", code: "CA"},
    //     {name: "Cape Verde", code: "CV"},
    //     {name: "Cayman Islands", code: "KY"},
    //     {name: "Central African Republic", code: "CF"},
    //     {name: "Chad", code: "TD"},
    //     {name: "Chile", code: "CL"},
    //     {name: "China", code: "CN"},
    //     {name: "Christmas Island", code: "CX"},
    //     {name: "Cocos (Keeling) Islands", code: "CC"},
    //     {name: "Colombia", code: "CO"},
    //     {name: "Comoros", code: "KM"},
    //     {name: "Congo", code: "CG"},
    //     {name: "Congo, The Democratic Republic of the", code: "CD"},
    //     {name: "Cook Islands", code: "CK"},
    //     {name: "Costa Rica", code: "CR"},
    //     {name: "Cote D'Ivoire", code: "CI"},
    //     {name: "Croatia", code: "HR"},
    //     {name: "Cuba", code: "CU"},
    //     {name: "Cyprus", code: "CY"},
    //     {name: "Czech Republic", code: "CZ"},
    //     {name: "Denmark", code: "DK"},
    //     {name: "Djibouti", code: "DJ"},
    //     {name: "Dominica", code: "DM"},
    //     {name: "Dominican Republic", code: "DO"},
    //     {name: "Ecuador", code: "EC"},
    //     {name: "Egypt", code: "EG"},
    //     {name: "El Salvador", code: "SV"},
    //     {name: "Equatorial Guinea", code: "GQ"},
    //     {name: "Eritrea", code: "ER"},
    //     {name: "Estonia", code: "EE"},
    //     {name: "Ethiopia", code: "ET"},
    //     {name: "Falkland Islands (Malvinas)", code: "FK"},
    //     {name: "Faroe Islands", code: "FO"},
    //     {name: "Fiji", code: "FJ"},
    //     {name: "Finland", code: "FI"},
    //     {name: "France", code: "FR"},
    //     {name: "French Guiana", code: "GF"},
    //     {name: "French Polynesia", code: "PF"},
    //     {name: "French Southern Territories", code: "TF"},
    //     {name: "Gabon", code: "GA"},
    //     {name: "Gambia", code: "GM"},
    //     {name: "Georgia", code: "GE"},
    //     {name: "Germany", code: "DE"},
    //     {name: "Ghana", code: "GH"},
    //     {name: "Gibraltar", code: "GI"},
    //     {name: "Greece", code: "GR"},
    //     {name: "Greenland", code: "GL"},
    //     {name: "Grenada", code: "GD"},
    //     {name: "Guadeloupe", code: "GP"},
    //     {name: "Guam", code: "GU"},
    //     {name: "Guatemala", code: "GT"},
    //     {name: "Guernsey", code: "GG"},
    //     {name: "Guinea", code: "GN"},
    //     {name: "Guinea-Bissau", code: "GW"},
    //     {name: "Guyana", code: "GY"},
    //     {name: "Haiti", code: "HT"},
    //     {name: "Heard Island and Mcdonald Islands", code: "HM"},
    //     {name: "Holy See (Vatican City State)", code: "VA"},
    //     {name: "Honduras", code: "HN"},
    //     {name: "Hong Kong", code: "HK"},
    //     {name: "Hungary", code: "HU"},
    //     {name: "Iceland", code: "IS"},
    //     {name: "India", code: "IN"},
    //     {name: "Indonesia", code: "ID"},
    //     {name: "Iran, Islamic Republic Of", code: "IR"},
    //     {name: "Iraq", code: "IQ"},
    //     {name: "Ireland", code: "IE"},
    //     {name: "Isle of Man", code: "IM"},
    //     {name: "Israel", code: "IL"},
    //     {name: "Italy", code: "IT"},
    //     {name: "Jamaica", code: "JM"},
    //     {name: "Japan", code: "JP"},
    //     {name: "Jersey", code: "JE"},
    //     {name: "Jordan", code: "JO"},
    //     {name: "Kazakhstan", code: "KZ"},
    //     {name: "Kenya", code: "KE"},
    //     {name: "Kiribati", code: "KI"},
    //     {name: "Korea, Democratic People'S Republic of", code: "KP"},
    //     {name: "Korea, Republic of", code: "KR"},
    //     {name: "Kuwait", code: "KW"},
    //     {name: "Kyrgyzstan", code: "KG"},
    //     {name: "Lao People'S Democratic Republic", code: "LA"},
    //     {name: "Latvia", code: "LV"},
    //     {name: "Lebanon", code: "LB"},
    //     {name: "Lesotho", code: "LS"},
    //     {name: "Liberia", code: "LR"},
    //     {name: "Libyan Arab Jamahiriya", code: "LY"},
    //     {name: "Liechtenstein", code: "LI"},
    //     {name: "Lithuania", code: "LT"},
    //     {name: "Luxembourg", code: "LU"},
    //     {name: "Macao", code: "MO"},
    //     {name: "Macedonia, The Former Yugoslav Republic of", code: "MK"},
    //     {name: "Madagascar", code: "MG"},
    //     {name: "Malawi", code: "MW"},
    //     {name: "Malaysia", code: "MY"},
    //     {name: "Maldives", code: "MV"},
    //     {name: "Mali", code: "ML"},
    //     {name: "Malta", code: "MT"},
    //     {name: "Marshall Islands", code: "MH"},
    //     {name: "Martinique", code: "MQ"},
    //     {name: "Mauritania", code: "MR"},
    //     {name: "Mauritius", code: "MU"},
    //     {name: "Mayotte", code: "YT"},
    //     {name: "Mexico", code: "MX"},
    //     {name: "Micronesia, Federated States of", code: "FM"},
    //     {name: "Moldova, Republic of", code: "MD"},
    //     {name: "Monaco", code: "MC"},
    //     {name: "Mongolia", code: "MN"},
    //     {name: "Montenegro", code: "ME"},
    //     {name: "Montserrat", code: "MS"},
    //     {name: "Morocco", code: "MA"},
    //     {name: "Mozambique", code: "MZ"},
    //     {name: "Myanmar", code: "MM"},
    //     {name: "Namibia", code: "NA"},
    //     {name: "Nauru", code: "NR"},
    //     {name: "Nepal", code: "NP"},
    //     {name: "Netherlands", code: "NL"},
    //     {name: "Netherlands Antilles", code: "AN"},
    //     {name: "New Caledonia", code: "NC"},
    //     {name: "New Zealand", code: "NZ"},
    //     {name: "Nicaragua", code: "NI"},
    //     {name: "Niger", code: "NE"},
    //     {name: "Nigeria", code: "NG"},
    //     {name: "Niue", code: "NU"},
    //     {name: "Norfolk Island", code: "NF"},
    //     {name: "Northern Mariana Islands", code: "MP"},
    //     {name: "Norway", code: "NO"},
    //     {name: "Oman", code: "OM"},
    //     {name: "Pakistan", code: "PK"},
    //     {name: "Palau", code: "PW"},
    //     {name: "Palestinian Territory, Occupied", code: "PS"},
    //     {name: "Panama", code: "PA"},
    //     {name: "Papua New Guinea", code: "PG"},
    //     {name: "Paraguay", code: "PY"},
    //     {name: "Peru", code: "PE"},
    //     {name: "Philippines", code: "PH"},
    //     {name: "Pitcairn", code: "PN"},
    //     {name: "Poland", code: "PL"},
    //     {name: "Portugal", code: "PT"},
    //     {name: "Puerto Rico", code: "PR"},
    //     {name: "Qatar", code: "QA"},
    //     {name: "Reunion", code: "RE"},
    //     {name: "Romania", code: "RO"},
    //     {name: "Russian Federation", code: "RU"},
    //     {name: "RWANDA", code: "RW"},
    //     {name: "Saint Helena", code: "SH"},
    //     {name: "Saint Kitts and Nevis", code: "KN"},
    //     {name: "Saint Lucia", code: "LC"},
    //     {name: "Saint Pierre and Miquelon", code: "PM"},
    //     {name: "Saint Vincent and the Grenadines", code: "VC"},
    //     {name: "Samoa", code: "WS"},
    //     {name: "San Marino", code: "SM"},
    //     {name: "Sao Tome and Principe", code: "ST"},
    //     {name: "Saudi Arabia", code: "SA"},
    //     {name: "Senegal", code: "SN"},
    //     {name: "Serbia", code: "RS"},
    //     {name: "Seychelles", code: "SC"},
    //     {name: "Sierra Leone", code: "SL"},
    //     {name: "Singapore", code: "SG"},
    //     {name: "Slovakia", code: "SK"},
    //     {name: "Slovenia", code: "SI"},
    //     {name: "Solomon Islands", code: "SB"},
    //     {name: "Somalia", code: "SO"},
    //     {name: "South Africa", code: "ZA"},
    //     {name: "South Georgia and the South Sandwich Islands", code: "GS"},
    //     {name: "Spain", code: "ES"},
    //     {name: "Sri Lanka", code: "LK"},
    //     {name: "Sudan", code: "SD"},
    //     {name: "Suriname", code: "SR"},
    //     {name: "Svalbard and Jan Mayen", code: "SJ"},
    //     {name: "Swaziland", code: "SZ"},
    //     {name: "Sweden", code: "SE"},
    //     {name: "Switzerland", code: "CH"},
    //     {name: "Syrian Arab Republic", code: "SY"},
    //     {name: "Taiwan, Province of China", code: "TW"},
    //     {name: "Tajikistan", code: "TJ"},
    //     {name: "Tanzania, United Republic of", code: "TZ"},
    //     {name: "Thailand", code: "TH"},
    //     {name: "Timor-Leste", code: "TL"},
    //     {name: "Togo", code: "TG"},
    //     {name: "Tokelau", code: "TK"},
    //     {name: "Tonga", code: "TO"},
    //     {name: "Trinidad and Tobago", code: "TT"},
    //     {name: "Tunisia", code: "TN"},
    //     {name: "Turkey", code: "TR"},
    //     {name: "Turkmenistan", code: "TM"},
    //     {name: "Turks and Caicos Islands", code: "TC"},
    //     {name: "Tuvalu", code: "TV"},
    //     {name: "Uganda", code: "UG"},
    //     {name: "Ukraine", code: "UA"},
    //     {name: "United Arab Emirates", code: "AE"},
    //     {name: "United Kingdom", code: "GB"},
    //     {name: "United States", code: "US"},
    //     {name: "United States Minor Outlying Islands", code: "UM"},
    //     {name: "Uruguay", code: "UY"},
    //     {name: "Uzbekistan", code: "UZ"},
    //     {name: "Vanuatu", code: "VU"},
    //     {name: "Venezuela", code: "VE"},
    //     {name: "Viet Nam", code: "VN"},
    //     {name: "Virgin Islands, British", code: "VG"},
    //     {name: "Virgin Islands, U.S.", code: "VI"},
    //     {name: "Wallis and Futuna", code: "WF"},
    //     {name: "Western Sahara", code: "EH"},
    //     {name: "Yemen", code: "YE"},
    //     {name: "Zambia", code: "ZM"},
    //     {name: "Zimbabwe", code: "ZW"},
    // ];
    genderList = [
        { name: "Select", code: "" },
        { name: "Male", code: "M" },
        { name: "Female", code: "F" },
        { name: "Others", code: "O" },
    ];
    locationList: any;
    programlevelList: any[] = [];
    today = new Date();
    submitted = false;
    registrationForm!: FormGroup;
    countryList: any;
    dateTime = new Date();
    updatedpasswords: FormGroup;
    private subs = new SubSink();
    constructor(
        private authService: AuthService,
        private formBuilder: FormBuilder,
        private locationService: LocationService,
        private toast: MessageService,
        private userManagementService: UserManagementService,
        private router: Router
    ) {

        this.registrationForm = this.formBuilder.group({
            name: ['', [Validators.required]],
            location_id: ['', [Validators.required]],
            phone: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            interested_country_id: [Number(this.user?.interested_country_id), [Validators.required]],
            last_degree_passing_year: [this.user?.last_degree_passing_year, [Validators.required]],
            intake_year_looking: [this.user?.intake_year_looking, [Validators.required]],
            intake_month_looking: [new Date(`${this.user?.intake_month_looking}-01-${this.user?.intake_year_looking}`), [Validators.required]],
            programlevel_id: [this.user?.programlevel_id, [Validators.required]],
            gender: [this.user?.gender, [Validators.required]],
            newsletter_consent: [this.user?.newsletter_consent == 1, [Validators.required]],
        });

        this.updatedpasswords = this.formBuilder.group({
            current_password: ['', [Validators.required]],
            new_password: ['', [Validators.required]],
            confirm_password: ['', [Validators.required]],
        });
    }

    get f() {
        return this.registrationForm.value;
    }

    ngOnInit(): void {
        this.dateTime.setDate(this.dateTime.getDate());
        this.GetLocationList();
        this.getProgramLevelList();
        this.getCountryList();
        this.authService.userData.subscribe(data => {
            console.log(data);
            if(data){
                this.user = data;
                let mon = this.getMonthName(this.user?.intake_month_looking);
                this.registrationForm = this.formBuilder.group({
                    name: [this.user?.name, [Validators.required]],
                    location_id: [this.user?.location_id, [Validators.required]],
                    phone: [this.user?.phone, [Validators.required]],
                    email: [this.user?.email, [Validators.required, Validators.email]],
                    interested_country_id: [Number(this.user?.interested_country_id), [Validators.required]],
                    last_degree_passing_year: [this.user?.last_degree_passing_year, [Validators.required]],
                    intake_year_looking: [this.user?.intake_year_looking, [Validators.required]],
                    intake_month_looking: [new Date(`${this.user?.intake_month_looking}-01-${this.user?.intake_year_looking}`), [Validators.required]],
                    programlevel_id: [this.user?.programlevel_id, [Validators.required]],
                    gender: [this.user?.gender, [Validators.required]],
                    newsletter_consent: [this.user?.newsletter_consent == 1 ? true : false, [Validators.required]],
                });
            }
        });
    }

    getMonthName(monthNumber: any) {
        const date = new Date();
        date.setMonth(monthNumber - 1);
        return date.toLocaleString('en-US', { month: 'long' });
    }

    getMonthNumberFromName(monthName: any) {
        const year = new Date().getFullYear();
        return new Date(`${monthName} 1, ${year}`).getMonth() + 1;
    }

    GetLocationList() {
        this.locationService.getLocation().subscribe(
            (res: any) => {
                this.locationList = [{ id: null, district: 'Select' }, ...res];
            },
            (error: any) => {
                this.toast.add({
                    severity: "warning",
                    summary: "Warning",
                    detail: error.error.message,
                });
            }
        );
    }

    getProgramLevelList() {
        this.authService.getProgramLevel().subscribe((response) => {
            this.programlevelList = response;
        });
    }

    getCountryList() {
        this.locationService.getCountry().subscribe(
            (res: any) => {
                this.countryList = res;
            },
            (error: any) => {
            }
        );
    }

    yearChage(event: any) {
        this.registrationForm?.get('intake_month_looking')?.setValue(event);
    }

    logout() {
        this.authService.logout().subscribe(data => {
            this.toast.add({
                severity: "success",
                summary: "Success",
                detail: "logged out successfully",
            });
            window.sessionStorage.clear();
            localStorage.clear();
            this.router.navigateByUrl("/login");
        });
    }

    onSubmit() {
        let data: any = {};
        if (this.registrationForm.value.invalid) {
            console.log('this', this.registrationForm.value.invalid);
        }
        let lastYear = ''
        if(this.registrationForm.value.intake_year_looking instanceof Date){
            lastYear = this.registrationForm.value.last_degree_passing_year.getFullYear()
        }else{
            lastYear = this.registrationForm.value.last_degree_passing_year;
        }
        let intakeMonth = '';
        if(this.registrationForm.value.intake_month_looking instanceof Date){
            intakeMonth = this.registrationForm.value.intake_month_looking.getMonth()
        }else{
            intakeMonth = this.registrationForm.value.intake_month_looking;
        }
        let intakeYearLooking = '';
        if(this.registrationForm.value.intake_year_looking instanceof Date){
            intakeYearLooking = this.registrationForm.value.intake_year_looking.getMonth()
        }else{
            intakeYearLooking = this.registrationForm.value.intake_year_looking;
        }

        let newsLetter = this.registrationForm.value.newsletter_consent == true ? 1 : 0;

        data['name'] = this.registrationForm.value.name;
        data['location_id'] = this.registrationForm.value.location_id;
        data['phone'] = this.registrationForm.value.phone;
        data['email'] = this.registrationForm.value.email;
        data['interested_country_id'] = this.registrationForm.value.interested_country_id;
        data['last_degree_passing_year'] = lastYear;
        data['intake_year_looking'] = '' + intakeYearLooking;
        data['intake_month_looking'] = '' + this.registrationForm.value.intake_month_looking.getMonth() + 1;
        data['programlevel_id'] = this.registrationForm.value.programlevel_id;
        data['gender'] = this.registrationForm.value.gender;
        data['newsletter_consent'] = newsLetter;

        if (!Object.keys(data).length) {
            this.toast.add({
                severity: "error",
                summary: "Warning",
                detail: 'Nothing to update',
            });
            return;
        }


        this.subs.sink = this.userManagementService.updateUserDetails(data).subscribe(data => {
            this.toast.add({ severity: 'success', summary: 'Success', detail: "Successfully Updated" });
        });
    }

    UserUpdatePassword(updatedpasswords:any){
        console.log(this.updatedpasswords.value);
        console.log(this.authService.userData.value);
        let data = this.updatedpasswords.value;

        this.subs.sink = this.userManagementService.CompareUserPassword(data).subscribe(passwordconfirmation => {
            if(!passwordconfirmation.success){
                return this.toast.add({ severity: 'error', summary: 'Success', detail: passwordconfirmation.message });
            }else if(data.new_password != data.confirm_password){
                this.toast.add({ severity: 'error', summary: 'Success', detail: "New Password and Confirm Password are Not Same" });
            }else if(data.confirm_password == data.current_password){
                this.toast.add({ severity: 'error', summary: 'Success', detail: "New Password and Old Password are same Please Change" });
            }
        });
        console.log("comes or not");
        
    }

}

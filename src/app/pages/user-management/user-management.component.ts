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
    // registrationForm!: FormGroup;
    countryList: any;
    dateTime = new Date();

    updatedpasswords: FormGroup;
    ShowCrntPass:boolean = false;
    CrntPass:string = "password";
    ShowNewPass:boolean = false;
    NewPass:string = "password";
    ShowCnfrmPass:boolean = false;
    CnfrmPass:string = "password";
    //ShowPersonalInfo:boolean = false;
    PasswordDivShow:boolean=false;
    PasswordSubmitted = false;
    newsLetter:boolean = false;
    PersonalInfo:any=[];

    private subs = new SubSink();
    constructor(
        private authService: AuthService,
        private formBuilder: FormBuilder,
        private locationService: LocationService,
        private toast: MessageService,
        private userManagementService: UserManagementService,
        private router: Router
    ) {

        // this.registrationForm = this.formBuilder.group({
        //     name: ['', [Validators.required]],
        //     location_id: ['', [Validators.required]],
        //     phone: ['', [Validators.required]],
        //     email: ['', [Validators.required, Validators.email]],
        //     interested_country_id: [Number(this.user?.interested_country_id), [Validators.required]],
        //     home_country: [this.user?.country, [Validators.required]],
        //     last_degree_passing_year: [this.user?.last_degree_passing_year, [Validators.required]],
        //     intake_year_looking: [this.user?.intake_year_looking, [Validators.required]],
        //     intake_month_looking: [new Date(`${this.user?.intake_month_looking}-01-${this.user?.intake_year_looking}`), [Validators.required]],
        //     programlevel_id: [this.user?.programlevel_id, [Validators.required]],
        //     gender: [this.user?.gender, [Validators.required]],
        //     // newsletter_consent: [this.user?.newsletter_consent == 1, [Validators.required]],
        // });

        this.updatedpasswords = this.formBuilder.group({
            current_password: ['', [Validators.required]],
            new_password: ['', [Validators.required]],
            confirm_password: ['', [Validators.required]],
        });
    }

    // get f() {
    //     return this.registrationForm.controls;
    // }

    get updatepassword(){
        return this.updatedpasswords.controls;
    }

    ngOnInit(): void {
        this.dateTime.setDate(this.dateTime.getDate());
        this.GetLocationList();
        this.getProgramLevelList();
        this.getCountryList();
        this.authService.userData.subscribe(data => {
            if(data){
                this.user = data;
                let mon = this.getMonthName(this.user?.intake_month_looking);
                this.newsLetter = this.user.newsletter_consent == 1 ? true : false;
                // this.registrationForm = this.formBuilder.group({
                //     name: [this.user?.name, [Validators.required]],
                //     location_id: [this.user?.location_id, [Validators.required]],
                //     phone: [this.user?.phone, [Validators.required]],
                //     email: [this.user?.email, [Validators.required, Validators.email]],
                //     interested_country_id: [Number(this.user?.interested_country_id), [Validators.required]],
                //     home_country: [Number(this.user?.country), [Validators.required]],
                //     last_degree_passing_year: [this.user?.last_degree_passing_year, [Validators.required]],
                //     intake_year_looking: [this.user?.intake_year_looking, [Validators.required]],
                //     intake_month_looking: [new Date(mon+"/"+this.user?.intake_year_looking), [Validators.required]],
                //     programlevel_id: [this.user?.programlevel_id, [Validators.required]],
                //     gender: [this.user?.gender, [Validators.required]],
                //     // newsletter_consent: [this.user?.newsletter_consent == 1 ? true : false, [Validators.required]],
                // });
                
            }
        });
        this.GetPersonalProfileData();
        
    }
    GetPersonalProfileData(){
        this.userManagementService.GetUserPersonalInfo().subscribe(data => {
            this.PersonalInfo = data;
            //console.log(data);
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

    // yearChage(event: any) {
    //     this.registrationForm?.get('intake_month_looking')?.setValue(event);
    // }

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

    onClickSubscribe() {
        this.subs.sink = this.userManagementService.GetPaidSubscriptionDetails().subscribe(data => {
            if (data.includes(1)) {
                this.router.navigate(["/pages/subscriptions/subscription-history"]);
            } else {
                this.router.navigate(["/pages/subscriptions"]);
            }
        });

        
    }

    // onSubmit() {
    //     let data: any = {};
    //     this.submitted = true;
    //     if (this.registrationForm.invalid) {
    //         return ;
    //     }
    //     // let lastYear = ''
    //     // if(this.registrationForm.value.intake_year_looking instanceof Date){
    //     //     lastYear = this.registrationForm.value.last_degree_passing_year.getMonth()
    //     // }else{
    //     //     lastYear = this.registrationForm.value.last_degree_passing_year;
    //     // }
    //     // let intakeMonth = '';
    //     // if(this.registrationForm.value.intake_month_looking instanceof Date){
    //     //     intakeMonth = this.registrationForm.value.intake_month_looking.getMonth()
    //     // }else{
    //     //     intakeMonth = this.registrationForm.value.intake_month_looking;
    //     // }
    //     // let intakeYearLooking = '';
    //     // if(this.registrationForm.value.intake_year_looking instanceof Date){
    //     //     intakeYearLooking = this.registrationForm.value.intake_year_looking.getMonth()
    //     // }else{
    //     //     intakeYearLooking = this.registrationForm.value.intake_year_looking;
    //     // }

    //     data['name'] = this.registrationForm.value.name;
    //     data['location_id'] = this.registrationForm.value.location_id; 
    //     //data['phone'] = this.registrationForm.value.phone;
    //     //data['email'] = this.registrationForm.value.email;
    //     data['interested_country_id'] = this.registrationForm.value.interested_country_id;
    //     data['country_id'] = this.registrationForm.value.home_country;
    //     data['last_degree_passing_year'] = new Date(this.registrationForm.value.last_degree_passing_year).getFullYear();
    //     data['intake_year_looking'] = new Date(this.registrationForm.value.intake_year_looking).getFullYear();
    //     data['intake_month_looking'] = new Date(this.registrationForm.value.intake_month_looking).getMonth() + 1;
    //     data['programlevel_id'] = this.registrationForm.value.programlevel_id;
    //     data['gender'] = this.registrationForm.value.gender;
    //     //data['newsletter_consent'] = newsLetter;

    //     if (!Object.keys(data).length) {
    //         this.toast.add({
    //             severity: "error",
    //             summary: "Warning",
    //             detail: 'Nothing to update',
    //         });
    //         return;
    //     }


    //     this.subs.sink = this.userManagementService.updateUserDetails(data).subscribe(data => {
    //         this.toast.add({ severity: 'success', summary: 'Success', detail: "Successfully Updated" });
    //     });
    // }

    UserUpdatePassword(updatedpasswords:any){
        let data = this.updatedpasswords.value;
        this.PasswordSubmitted = true;
        if (this.updatedpasswords.invalid) {
            return ;
        }
        this.subs.sink = this.userManagementService.CompareUserPassword(data).subscribe(passwordconfirmation => {
            if(passwordconfirmation.severity == "success"){
                this.updatedpasswords.patchValue({
                    current_password: "",
                    new_password: "",
                    confirm_password: ""
                });
            }
            return this.toast.add({ severity: passwordconfirmation.severity, summary: 'Success', detail: passwordconfirmation.message });
        });
        this.PasswordSubmitted = false;
    }

    ShowCurrentPassword(){
        if(this.ShowCrntPass == true){
            this.ShowCrntPass = false;
            this.CrntPass = "password";
        }else{
            this.ShowCrntPass = true;
            this.CrntPass = "text";
        }
    }

    ShowNewPassword(){
        if(this.ShowNewPass == true){
            this.ShowNewPass = false;
            this.NewPass = "password";
        }else{
            this.ShowNewPass = true;
            this.NewPass = "text";
        }
    }

    ShowConfirmPassword(){
        if(this.ShowCnfrmPass == true){
            this.ShowCnfrmPass = false;
            this.CnfrmPass = "password";
        }else{
            this.ShowCnfrmPass = true;
            this.CnfrmPass = "text";
        }
    }

    // EditPageShowAndHide(mode:string){
    //     if(mode == "Edit"){
    //         this.ShowPersonalInfo = true;
    //     }else{
    //         this.ShowPersonalInfo = false;
    //     }
    // }

    NewsLetterUpdate(e:any){
        let isChecked = e.checked == true ? 1 : 0;
        let OnOrOff = isChecked == 1 ? "On" : "Off";
        this.subs.sink = this.userManagementService.UpdateNewsLetter(isChecked).subscribe(data => {
            
            return this.toast.add({ severity: 'success', summary: 'Success', detail: "Notification Turned "+OnOrOff+" successfully."});
        });
    }

    ShowPasswordDiv(){
        if(this.PasswordDivShow == true){
            this.PasswordDivShow = false;
        }else{
            this.PasswordDivShow = true;
        }
    }
}

export interface UserData {
    user: User;
    token: any;
}

export interface User {
    id: string;
    name: string;
    email: string;
    emailAddress: string;
    fullName: string;
    contactNumber: string;
    interestedCountry: string;
    lastDegreePassingYear: string;
    intakeYear: string;
    intakeMonth: string;
    gender: string;
    programLevel: string;
    location: string;
    email_verified_at: any;
    status: number;
    usertype_id: number;
    platform_id: number;
    created_at: string;
    updated_at: string;
    deleted_at: any;
    subscription_name: string;
    location_name: string;
    usertype_name: string;
    newsletter_consent: number;
    subscription_plan: string;
    location_id: string;
    phone: string;
    subscription: string;
    subscription_id: string;
    interested_country_id: string;
    last_degree_passing_year: string;
    programlevel_id: string;
    intake_year_looking: string;
    intake_month_looking: string;
    countries_certificate: string;
    type: string;
    state: string;
    district: string;
    programlevel: string;
    country: string;
    interested_country_name: string;
    student_type_id: number;
    education_level: string;
    user_id: number;
    is_phn_or_whs_verified: number;
    login_status: number | string;
    ilearn_popup_status: number;
    country_code: number;
    home_country_id: number;
    subscription_exists: number;
    social_password: number;
    city_id: number;
}

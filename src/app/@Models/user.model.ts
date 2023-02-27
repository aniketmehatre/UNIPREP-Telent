export interface UserData {
  user: User;
  token: any;
}
export interface User {
  id: string;
  email: string;
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
}

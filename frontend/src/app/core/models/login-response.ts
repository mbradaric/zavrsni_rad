export interface LoginResponse {
  access_token: string;
  token_type: string;
  first_name: string;
  last_name: string;
  is_admin: boolean;
}

export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
  avatar: string;
  lat: number;
  lng: number;
  me?: boolean;
}

export interface SingleUserResponse {
  user: User;
}

export interface UserLogin {
  email: string;
  password: string;
  lat?: number;
  lng?: number;
}

export interface UserLoginGoogle {
  token: string;
  lat?: number;
  lng?: number;
  firebaseToken?: string;
}

export interface UserLoginFacebook {
  token: string;
  lat?: number;
  lng?: number;
  firebaseToken?: string;
}

export interface UserProfileEdit {
  name: string;
  email: string;
}

export interface UserPhotoEdit {
  avatar: string;
}

export interface UserPasswordEdit {
  password: string;
}
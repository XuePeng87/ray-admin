// 认证

export interface ImageVirefyCodeResponse {
  uuid: string;
  img: string;
}

export interface LoginRequest {
  phoneNumber: string;
  password: string;
  uuid?: string;
  code?: string;
}

// 当前用户信息

export interface CurrnetUser {
  code?: string;
  phoneNumber?: string;
  name?: string;
  email?: string;
  avatar?: string;
  roles?: CurrentUserRole[];
  funcs?: CurrentUserFunc[];
}

export interface CurrentUserRole {
  code?: string;
  name?: string;
}

export interface CurrentUserFunc {
  name: string;
  type: number;
  icon: string;
  path: string;
  linkable: boolean;
  cacheable: boolean;
  visible: boolean;
  componentName: string;
  componentPath: string;
  children?: CurrentUserFunc[];
}

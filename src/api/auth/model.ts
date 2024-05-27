/**
 * 图形验证码响应
 */
export interface ImageVirefyCodeResponse {
  /**
   * 验证码缓存key
   */
  uuid: string;
  /**
   * 验证码图片Base64字符串
   */
  img: string;
}

/**
 * 登录请求参数
 */
export interface LoginRequest {
  /**
   * 用户名
   */
  phoneNumber: string;
  /**
   * 密码
   */
  password: string;

  /**
   * 验证码缓存key
   */
  uuid?: string;

  /**
   * 验证码
   */
  code?: string;
}

/**
 * 登录响应
 */
export interface LoginResponse {
  /**
   * 访问token
   */
  accessToken?: string;
  /**
   * 过期时间(单位：毫秒)
   */
  expires?: number;
  /**
   * 刷新token
   */
  refreshToken?: string;
  /**
   * token 类型
   */
  tokenType?: string;
}

/**
 * 登录用户信息
 */
export interface CurrnetUser {
  code?: string;
  phoneNumber?: string;
  name?: string;
  email?: string;
  avatar?: string;
  roles: CurrentUserRole[];
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

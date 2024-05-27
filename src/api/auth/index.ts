import request from "@/utils/request";
import { ImageVirefyCodeResponse, LoginRequest, CurrnetUser } from "./model";

class AuthAPI {
  /**
   * 登录API
   *
   * @param data {LoginData}
   * @returns
   */
  static login(data: LoginRequest) {
    return request<any, string>({
      url: "/v1/auth/v1/login",
      method: "post",
      data: data,
    });
  }

  /**
   * 注销API
   */
  static logout() {
    return request({
      url: "/v1/auth/v1/logout",
      method: "post",
    });
  }

  /**
   * 获取验证码
   */
  static getCaptcha() {
    return request<any, ImageVirefyCodeResponse>({
      url: "/v1/auth/v1/login-vc",
      method: "get",
    });
  }

  /**
   * 登录成功后获取用户信息（昵称、头像、权限集合和角色集合）
   */
  static getInfo() {
    return request<any, CurrnetUser>({
      url: "/v1/auth/v1/current-user",
      method: "get",
    });
  }
}

export default AuthAPI;

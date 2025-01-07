import request from "@/utils/request";
import { UserQueryRequest, UserResponse, UserFormRequest } from "./model";

class UserAPI {
  // 分页查询系统用户
  static getUserPage(queryParams: UserQueryRequest) {
    return request<any, PageResult<UserResponse[]>>({
      url: "/v1/users/v1/page",
      method: "get",
      params: queryParams,
    });
  }

  // 根据编号查询系统用户
  static getUserByCode(code: string) {
    return request<any, UserResponse>({
      url: "/v1/users/v1/" + code,
      method: "get",
    });
  }

  // 创建系统用户
  static createUser(data: UserFormRequest) {
    return request({
      url: "/v1/users/v1",
      method: "post",
      data: data,
    });
  }

  // 修改系统用户
  static updateUser(code: string, data: UserFormRequest) {
    return request({
      url: "/v1/users/v1/" + code,
      method: "put",
      data: data,
    });
  }

  // 根据编号删除系统用户
  static deleteUserByCode(code: string) {
    return request({
      url: "/v1/users/v1/" + code,
      method: "delete",
    });
  }

  // 根据编号重置用户登录密码
  static resetPassword(code: string) {
    return request({
      url: "/v1/users/v1/" + code + "/reset-password",
      method: "put",
    });
  }
}

export default UserAPI;

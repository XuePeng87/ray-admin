import request from "@/utils/request";
import {
  RoleQueryRequest,
  RoleResponse,
  RolePageResponse,
  RoleFormRequest,
} from "./model";

class RoleAPI {
  // 分页查询系统角色
  static getRolePage(queryParams: RoleQueryRequest) {
    return request<any, RolePageResponse>({
      url: "/v1/roles/v1/page",
      method: "get",
      params: queryParams,
    });
  }

  // 根据编号查询系统角色
  static getRoleByCode(code: string) {
    return request<any, ResponseData<RoleResponse>>({
      url: "/v1/roles/v1/" + code,
      method: "get",
    });
  }

  // 创建系统角色
  static createRole(data: RoleFormRequest) {
    return request({
      url: "/v1/roles/v1",
      method: "post",
      data: data,
    });
  }

  // 修改系统角色
  static updateRole(code: string, data: RoleFormRequest) {
    return request({
      url: "/v1/roles/v1/" + code,
      method: "put",
      data: data,
    });
  }

  // 根据编号删除系统角色
  static deleteRoleByCode(code: string) {
    return request({
      url: "/v1/roles/v1/" + code,
      method: "delete",
    });
  }

  // 给角色授权功能
  static saveFuncToRole(code: string, funcCodes: string[]) {
    return request({
      url: "/v1/roles/v1/" + code + "/grant-func",
      method: "post",
      data: funcCodes,
    });
  }

  // 查询角色授权的功能
  static findFuncByCode(code: string) {
    return request<any, string[]>({
      url: "/v1/roles/v1/" + code + "/grant-func",
      method: "get",
    });
  }
}

export default RoleAPI;

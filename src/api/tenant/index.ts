import request from "@/utils/request";
import { TenantQueryRequest, TenantResponse, TenantFormRequest } from "./model";

class TenantAPI {
  // 分页查询系统租户
  static getTenantPage(queryParams: TenantQueryRequest) {
    return request<any, PageResult<TenantResponse[]>>({
      url: "/v1/tenants/v1/page",
      method: "get",
      params: queryParams,
    });
  }

  // 根据条件查询查询系统租户
  static getTenantList(queryParams?: TenantQueryRequest) {
    return request<any, TenantResponse[]>({
      url: "/v1/tenants/v1/list",
      method: "get",
      params: queryParams,
    });
  }

  // 根据编号查询系统租户
  static getTenantByCode(code: string) {
    return request<any, TenantResponse>({
      url: "/v1/tenants/v1/" + code,
      method: "get",
    });
  }

  // 创建系统租户
  static createTenant(data: TenantFormRequest) {
    return request({
      url: "/v1/tenant/v1",
      method: "post",
      data: data,
    });
  }

  // 修改系统租户
  static updateTenant(code: string, data: TenantFormRequest) {
    return request({
      url: "/v1/tenants/v1/" + code,
      method: "put",
      data: data,
    });
  }

  // 根据编号删除系统租户
  static deleteTenantByCode(code: string) {
    return request({
      url: "/v1/tenants/v1/" + code,
      method: "delete",
    });
  }
}

export default TenantAPI;

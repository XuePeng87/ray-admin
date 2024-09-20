import request from "@/utils/request";
import { DeptQueryRequest, DeptFormRequest, DeptResponse } from "./model";

class DeptAPI {
  // 查询系统部门树
  static getDeptTree(queryParams?: DeptQueryRequest) {
    return request<any, DeptResponse[]>({
      url: "/v1/depts/v1",
      method: "get",
      params: queryParams,
    });
  }

  // 根据编号查询系统部门
  static getDeptByCode(code: string) {
    return request<any, DeptResponse>({
      url: "/v1/depts/v1/" + code,
      method: "get",
    });
  }

  // 创建系统部门
  static createDept(data: DeptFormRequest) {
    return request({
      url: "/v1/depts/v1",
      method: "post",
      data: data,
    });
  }

  // 修改系统部门
  static updateDept(code: string, data: DeptFormRequest) {
    return request({
      url: "/v1/depts/v1/" + code,
      method: "put",
      data: data,
    });
  }

  /**
   * 根据编号删除系统部门
   *
   * @param ids
   */
  static deleteByIds(code: string) {
    return request({
      url: "/v1/depts/v1/" + code,
      method: "delete",
    });
  }
}

export default DeptAPI;

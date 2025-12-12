import request from "@/utils/request";
import { FuncQueryRequest, FuncResponse, FuncFormRequest } from "./model";

class MenuAPI {
  // 查询系统功能树
  static getFuncTree(queryParams?: FuncQueryRequest) {
    return request<any, FuncResponse[]>({
      url: "/v1/funcs/v1/tree",
      method: "get",
      params: queryParams,
    });
  }

  // 根据编号查询系统功能
  static getFuncByCode(code: string) {
    return request<any, FuncResponse>({
      url: "/v1/funcs/v1/" + code,
      method: "get",
    });
  }

  // 创建系统功能
  static add(data: FuncFormRequest) {
    return request({
      url: "/v1/funcs/v1",
      method: "post",
      data: data,
    });
  }

  // 修改系统功能
  static update(code: string, data: FuncFormRequest) {
    return request({
      url: "/v1/funcs/v1/" + code,
      method: "put",
      data: data,
    });
  }

  // 根据编号删除系统功能
  static deleteByCode(code: string) {
    return request({
      url: "/v1/funcs/v1/" + code,
      method: "delete",
    });
  }
}

export default MenuAPI;

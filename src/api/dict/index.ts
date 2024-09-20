import request from "@/utils/request";
import {
  DictQueryRequest,
  DictPageResponse,
  DictResponse,
  DictFormRequest,
  DictItemQueryRequest,
  DictItemPageResponse,
  DictItemFormRequest,
} from "./model";

class DictAPI {
  // 分页查询系统字典
  static getDictPage(queryParams: DictQueryRequest) {
    return request<any, DictPageResponse>({
      url: "/v1/dicts/v1/page",
      method: "get",
      params: queryParams,
    });
  }

  // 根据编号查询系统字典
  static getDictByCode(code: string) {
    return request<any, ResponseData<DictResponse>>({
      url: "/v1/dicts/v1/" + code,
      method: "get",
    });
  }

  // 创建系统字典
  static createDict(data: DictFormRequest) {
    return request({
      url: "/v1/dicts/v1",
      method: "post",
      data: data,
    });
  }

  // 修改系统字典
  static updateDict(code: string, data: DictFormRequest) {
    return request({
      url: "/v1/dicts/v1/" + code,
      method: "put",
      data: data,
    });
  }

  // 根据编号批量删除系统字典
  static deleteDictByCodes(codes: string[]) {
    return request({
      url: "/v1/dicts/v1",
      method: "delete",
      data: codes,
    });
  }

  // ----------

  // 分页查询系统字典项
  static getDictItemPage(queryParams: DictItemQueryRequest) {
    return request<any, DictItemPageResponse>({
      url: "/v1/dict-items/v1/page",
      method: "get",
      params: queryParams,
    });
  }

  // 根据编号查询系统字典项
  static getDictItemByCode(code: string) {
    return request<any, DictItemPageResponse>({
      url: "/v1/dict-items/v1/" + code,
      method: "get",
    });
  }

  // 创建系统字典项
  static createDictItem(data: DictItemFormRequest) {
    return request({
      url: "/v1/dict-items/v1",
      method: "post",
      data: data,
    });
  }

  // 修改系统字典项
  static updateDictItem(code: string, data: DictItemFormRequest) {
    return request({
      url: "/v1/dict-items/v1/" + code,
      method: "put",
      data: data,
    });
  }

  // 根据编号批量删除系统字典项
  static deleteDictItemByCodes(codes: string[]) {
    return request({
      url: "/v1/dict-items/v1",
      method: "delete",
      data: codes,
    });
  }
}

export default DictAPI;

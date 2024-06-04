import request from "@/utils/request";
import {
  DictQueryRequest,
  DictPageResponse,
  DictResponse,
  DictRequest,
  DictItemQueryRequest,
  DictItemResponse,
  DictItemPageResponse,
  DictItemRequest,
} from "./model";

class DictAPI {
  static getDictPage(queryParams: DictQueryRequest) {
    return request<any, DictPageResponse>({
      url: "/v1/dicts/v1/page",
      method: "get",
      params: queryParams,
    });
  }

  static getDictByCode(code: string) {
    return request<any, ResponseData<DictResponse>>({
      url: "/v1/dicts/v1/" + code,
      method: "get",
    });
  }

  static createDict(data: DictRequest) {
    return request({
      url: "/v1/dicts/v1",
      method: "post",
      data: data,
    });
  }

  static updateDict(code: string, data: DictRequest) {
    return request({
      url: "/v1/dicts/v1/" + code,
      method: "put",
      data: data,
    });
  }

  static deleteDictByCodes(codes: string[]) {
    return request({
      url: "/v1/dicts/v1",
      method: "delete",
      data: codes,
    });
  }

  static getDictItemPage(queryParams: DictItemQueryRequest) {
    return request<any, DictItemPageResponse>({
      url: "/v1/dict-items/v1/page",
      method: "get",
      params: queryParams,
    });
  }

  static getDictItemByCode(code: string) {
    return request<any, DictItemPageResponse>({
      url: "/v1/dict-items/v1/" + code,
      method: "get",
    });
  }

  static createDictItem(data: DictItemRequest) {
    return request({
      url: "/v1/dict-items/v1",
      method: "post",
      data: data,
    });
  }

  static updateDictItem(code: string, data: DictItemRequest) {
    return request({
      url: "/v1/dict-items/v1/" + code,
      method: "put",
      data: data,
    });
  }

  static deleteDictItemByCodes(codes: string[]) {
    return request({
      url: "/v1/dict-items/v1",
      method: "delete",
      data: codes,
    });
  }
}

export default DictAPI;

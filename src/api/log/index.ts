import request from "@/utils/request";
import {
  AuthLogQueryRequest,
  AuthLogResponse,
  OperateLogQueryRequest,
  OperateLogResponse,
  OperateLogDetailResponse,
} from "./model";

class AuthLogAPI {
  // 分页查询系统登录日志
  static getAuthLogPage(queryParams: AuthLogQueryRequest) {
    return request<any, PageResult<AuthLogResponse[]>>({
      url: "/v1/auth-logs/v1/page",
      method: "get",
      params: queryParams,
    });
  }
}

// 分页查询系统操作日志
class OperationLogAPI {
  static getOperateLogPage(queryParams: OperateLogQueryRequest) {
    return request<any, PageResult<OperateLogQueryRequest[]>>({
      url: "/v1/operate-logs/v1/page",
      method: "get",
      params: queryParams,
    });
  }

  // 查询系统操作日志的详情
  static getOperateLogDetail(logId: number) {
    return request<any, OperateLogDetailResponse>({
      url: "/v1/operate-log-details/v1/" + logId,
      method: "get",
    });
  }
}

export { AuthLogAPI, OperationLogAPI };

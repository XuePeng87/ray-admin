// 系统日志类型枚举
export enum SysAuthLogType {
  LOGIN = 1, // 登录日志
  LOGOUT = 2, // 登出日志
}

// 系统日志查询请求对象
export interface AuthLogQueryRequest extends PageQuery {
  type?: SysAuthLogType;
  loginIp?: string;
  beginCreateTime?: string;
  endCreateTime?: string;
}

// 系统日志响应对象
export interface AuthLogResponse {
  type?: SysAuthLogType;
  phoneNumber?: string;
  loginIp?: string;
  browser?: string;
  browserVersion?: string;
  platform?: string;
  os?: string;
  osVersion?: string;
  engine?: string;
  engineVersion?: string;
  exeTime?: number;
  createUser?: string;
  createTime?: string;
  modifyUser?: string;
  modifyTime?: string;
}

// 系统日志分页列表对象
export type AuthLogPageResponse = PageResult<AuthLogResponse[]>;

// 系统日志类型枚举
export enum SysOperateLogType {
  ACCESS = 1, // 操作
  ERROR = 2, // 错误
}

// 操作日志查询请求对象
export interface OperateLogQueryRequest extends PageQuery {
  type?: SysOperateLogType;
  module?: string;
  func?: string;
  ip?: string;
  beginCreateTime?: string;
  endCreateTime?: string;
}

// 操作日志响应对象
export interface OperateLogResponse {
  id?: number;
  type?: SysOperateLogType;
  phoneNumber?: string;
  module?: string;
  func?: string;
  remark?: string;
  action?: string;
  ip?: string;
  url?: string;
  uri?: string;
  method?: string;
  className?: string;
  methodName?: string;
  browser?: string;
  browserVersion?: string;
  platform?: string;
  os?: string;
  osVersion?: string;
  engine?: string;
  engineVersion?: string;
  exeTime?: number;
  createUser?: string;
  createTime?: string;
  modifyUser?: string;
  modifyTime?: string;
}

// 操作日志分页列表对象
export type OperateLogPageResponse = PageResult<OperateLogResponse[]>;

// 操作日志详情响应对象
export interface OperateLogDetailResponse {
  param?: string; // 请求路径参数
  args?: string; // 请求方法参数
  result?: string; // 返回值
  error?: string; // 错误信息
}

// 系统字典查询请求对象
export interface DictQueryRequest extends PageQuery {
  name?: string;
  value?: string;
  status?: number;
}

// 系统字典响应对象
export interface DictResponse {
  code: string;
  name: string;
  value: string;
  status: number;
  remark: string;
}

// 系统字典分页列表对象
export type DictPageResponse = PageResult<DictResponse[]>;

// 系统字典创建、修改请求对象
export interface DictFormRequest {
  code?: string;
  name?: string;
  value?: string;
  status: number;
  remark?: string;
}

// ------------------

// 系统字典项查询对象
export interface DictItemQueryRequest extends PageQuery {
  dictValue: string;
  code?: string;
  name?: string;
  value?: string;
  status?: number;
}

// 系统字典项响应对象
export interface DictItemResponse {
  dictValue: string;
  code: string;
  name: string;
  value: string;
  status: number;
  sequence: number;
  remark: string;
}

// 系统字典项分页列表对象
export type DictItemPageResponse = PageResult<DictItemResponse[]>;

// 系统字典项创建、修改对象
export interface DictItemFormRequest {
  dictValue: string;
  code?: string;
  name?: string;
  value?: string;
  status: number;
  sequence: number;
  remark?: string;
}

// 系统字典

export interface DictQueryRequest extends PageQuery {
  name?: string;
  value?: string;
  status?: number;
}

export interface DictResponse {
  code: string;
  name: string;
  value: string;
  status: number;
  remark: string;
}

export type DictPageResponse = PageResult<DictResponse[]>;

export interface DictRequest {
  code?: string;
  name?: string;
  value?: string;
  status: number;
  remark?: string;
}

// 系统字典项

export interface DictItemQueryRequest extends PageQuery {
  dictValue: string;
  code?: string;
  name?: string;
  value?: string;
  status?: number;
}

export interface DictItemResponse {
  dictValue: string;
  code: string;
  name: string;
  value: string;
  status: number;
  sequence: number;
  remark: string;
}

export type DictItemPageResponse = PageResult<DictItemResponse[]>;

export interface DictItemRequest {
  dictValue: string;
  code?: string;
  name?: string;
  value?: string;
  status: number;
  sequence: number;
  remark?: string;
}

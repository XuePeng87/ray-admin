/**
 * 系统部分查询请求对象
 */
export interface DeptQueryRequest {
  name?: string;
}

/**
 * 系统部门响应对象
 */
export interface DeptResponse {
  parentCode: string;
  code: string;
  name: string;
  status: number;
  sequence: number;
  remark: string;
  children: DeptResponse[];
}

/**
 * 系统部门创建、修改请求对象
 */
export interface DeptFormRequest {
  parentCode?: string;
  code?: string;
  name?: string;
  sequence?: number;
  status?: number;
}

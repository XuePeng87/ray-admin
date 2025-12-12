/**
 * 系统部门查询请求对象
 */
export interface DeptQueryRequest {
  tenantCode?: string;
  name?: string;
}

/**
 * 系统部门响应对象
 */
export interface DeptResponse {
  tenantCode: string;
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
  tenantCode?: string;
  parentCode?: string;
  code?: string;
  name?: string;
  sequence?: number;
  status?: number;
}

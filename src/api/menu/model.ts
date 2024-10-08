/**
 * 系统菜单查询请求对象
 */
export interface FuncQueryRequest {
  name?: string;
}

/**
 * 系统菜单响应对象
 */
export interface FuncResponse {
  parentCode: string;
  name: string;
  code: string;
  type: number;
  icon: string;
  path: string;
  redirect: string;
  linkable: boolean;
  cacheable: boolean;
  visible: boolean;
  alwaysShow: boolean;
  permission: string;
  component: string;
  sequence: number;
  remark: string;
  children: FuncResponse[];
}

/**
 * 系统菜单创建、修改请求对象
 */
export interface FuncFormRequest {
  parentCode?: string;
  name?: string;
  code?: string;
  type?: number;
  icon?: string;
  path?: string;
  redirect?: string;
  linkable?: boolean;
  cacheable?: boolean;
  visible?: boolean;
  alwaysShow?: boolean;
  permission?: string;
  component?: string;
  sequence?: number;
  remark?: string;
}

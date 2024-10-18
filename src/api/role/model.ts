// 系统角色查询请求对象
export interface RoleQueryRequest extends PageQuery {
  remark?: string;
}

// 系统角色响应对象
export interface RoleResponse {
  code?: string;
  name?: string;
  status?: number;
  sequence?: number;
  remark?: string;
}

// 系统角色分页列表对象
export type RolePageResponse = PageResult<RoleResponse[]>;

// 系统角色创建、修改请求对象
export interface RoleFormRequest {
  code?: string;
  name?: string;
  status?: number;
  sequence?: number;
  remark?: string;
}

// /**
//  * 角色查询参数
//  */
// export interface RoleQuery extends PageQuery {
//   keywords?: string;
// }

// /**
//  * 角色分页对象
//  */
// export interface RolePageVO {
//   /**
//    * 角色编码
//    */
//   code?: string;

//   /**
//    * 角色ID
//    */
//   id?: number;
//   /**
//    * 角色名称
//    */
//   name?: string;
//   /**
//    * 排序
//    */
//   sort?: number;
//   /**
//    * 角色状态
//    */
//   status?: number;
//   /**
//    * 创建时间
//    */
//   createTime?: Date;
//   /**
//    * 修改时间
//    */
//   updateTime?: Date;
// }

// /**
//  * 角色分页
//  */
// export type RolePageResult = PageResult<RolePageVO[]>;

// /**
//  * 角色表单对象
//  */
// export interface RoleForm {
//   /**
//    * 角色ID
//    */
//   id?: number;

//   /**
//    * 角色编码
//    */
//   code: string;
//   /**
//    * 数据权限
//    */
//   dataScope?: number;

//   /**
//    * 角色名称
//    */
//   name: string;
//   /**
//    * 排序
//    */
//   sort?: number;
//   /**
//    * 角色状态(1-正常；0-停用)
//    */
//   status?: number;
// }

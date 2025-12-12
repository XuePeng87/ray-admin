// 系统用户查询请求对象
export interface UserQueryRequest extends PageQuery {
  phoneNumber?: string;
  name?: string;
  deptCode?: string;
  beginCreateTime?: string;
  endCreateTime?: string;
}

// 系统用户响应对象
export interface UserResponse {
  deptCode?: string;
  roleCodes?: string[];
  phoneNumber?: string;
  name?: string;
  email?: string;
  status?: number;
  remark?: string;
}

// 系统用户分页列表对象
export type UserPageResponse = PageResult<UserResponse[]>;

/**
 * 系统用户创建、修改请求对象
 */
export interface UserFormRequest {
  deptCode?: string;
  roleCodes?: string[];
  code?: string;
  phoneNumber?: string;
  name?: string;
  email?: string;
  status?: number;
  remark?: string;
}

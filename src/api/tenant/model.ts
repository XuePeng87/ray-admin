// 系统租户查询请求对象
export interface TenantQueryRequest extends PageQuery {
  phoneNumber?: string;
  name?: string;
  email?: string;
  beginExpireTime?: string;
  endExpireTime?: string;
  beginCreateTime?: string;
  endCreateTime?: string;
}

// 系统租户响应对象
export interface TenantResponse {
  code: string;
  phoneNumber?: string;
  name: string;
  email?: string;
  status?: number;
  expireTime?: string;
  remark?: string;
}

// 系统租户分页列表对象
export type TenantPageResponse = PageResult<TenantResponse[]>;

/**
 * 系统租户创建、修改对象
 */
export interface TenantFormRequest {
  phoneNumber?: string;
  name?: string;
  email?: string;
  status?: number;
  expireTime?: string;
  remark?: string;
}

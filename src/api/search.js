/**
 * 搜索请求
 */
import request from '@/utils/request'
// 搜索联想请求接口
export const getSearchSuggestions = q => {
  return request({
    method: 'GET',
    url: '/app/v1_0/suggestion',
    params: {
      // 联想建议搜索关键词
      q
    }
  })
}
// 搜索结果请求接口
export const getSearchResualt = params => {
  return request({
    method: 'GET',
    url: '/app/v1_0/search',
    params
  })
}
// 获取用户搜索历史请求接口
export const getSearchHistories = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/search/histories'
  })
}

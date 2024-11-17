export const getBannerList = (data) => {
  return {
    url: '/api/banner/list',
    data,
    method: 'get'
  }
}
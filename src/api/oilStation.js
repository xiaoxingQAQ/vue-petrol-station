import request from '@/utils/request';

// 查询今日警告
export function getSelectByOrg(params) {
  return request({
    url: '/device/petrol/station/selectByOrg',
    method: 'get',
    params
  })
}

// 查询加油站组织列表
export function getOrgStr(params) {
  return request({
    url: '/device/petrol/station/org',
    method: 'get',
    params
  })
}

// 查询车辆抓拍总数
export function getCaptureSelectNum(params) {
  return request({
    url: '/device/car/capture/selectNum',
    method: 'get',
    params
  })
}

// 查询进站车辆
export function getCaptureSelectPullIn(params) {
  return request({
    url: '/device/car/capture/selectPullIn',
    method: 'get',
    params
  })
}
// 查询过往车辆
export function getCaptureSelectPassing(params) {
  return request({
    url: '/device/car/capture/selectPassing',
    method: 'get',
    params
  })
}

// 查询进便利店的人数
export function getPersonSelcetPullIn(params) {
  return request({
    url: '/device/person/capture/selcetPullIn',
    method: 'get',
    params
  })
}

// 查询进站车辆详情
export function getCaptureSelectLimit(params) {
  return request({
    url: '/device/car/capture/selectLimit',
    method: 'get',
    params
  })
}

// 统计本周每天客流量总数
export function getCaptureSelectWeek() {
  return request({
    url: '/device/car/capture/selectWeek',
    method: 'get',
  })
}

// 查询历史同期
export function getCaptureSelectHistory() {
  return request({
    url: '/device/car/capture/selectHistory',
    method: 'get',
  })
}

// 油罐实时状态 查询
export function getOilOmeterSelect(params) {
  return request({
    url: '/device/oil/ometer/select',
    method: 'get',
    params
  })
}

// 油罐实时状态 添加修改
export function getOilOmeterSave(data) {
  return request({
    url: '/device/oil/ometer/save',
    method: 'post',
    data
  })
}

// 油罐实时状态 添加修改
export function getOilOmeterDelete(data) {
  return request({
    url: '/device/oil/ometer/delete',
    method: 'post',
    data
  })
}

// 今日销售 查询
export function getMarketingSelect(params) {
  return request({
    url: '/device/marketing/select',
    method: 'get',
    params
  })
}

// 今日销售 添加 修改
export function getMarketingSave(data) {
  return request({
    url: '/device/marketing/save',
    method: 'post',
    data
  })
}

// 查询所有营收额汇总
export function getSelectToDay() {
  return request({
    url: '/device/marketing/selectToDay',
    method: 'get'
  })
}

// 事件算法列表
export function getAlgorithmList(params) {
  return request({
    url: '/device/algorithm/list',
    method: 'get',
    params
  })
}
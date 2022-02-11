import request from '@/utils/request';

// 批量删除
export function batchDeletes (params) {
  return request({
    url: 'device/car/monitor/deletes?ids=' + params,
    method: 'post',
  })
}

// 添加车辆布控信息, 修改车辆布控信息
export function saveAddEidt (params) {
  return request({
    url: 'device/car/monitor/save',
    method: 'post',
    data: params
  })
}

// 查询
export function getSelects(params) {
  return request({
    url: 'device/car/monitor/selects',
    method: 'get',
    params
  })
}

// 车辆布控
export function monitorControl(params) {
  return request({
    url: 'device/car/monitor/control',
    method: 'get',
    params
  })
}
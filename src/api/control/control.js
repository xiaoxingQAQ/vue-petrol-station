import request from '@/utils/request';

// 添加档案
export function addRecord(data) {
  return request({
    url: '/device/archives/save',
    method: 'post',
    data
  })
}

// 删除档案
export function deleteRecord(data) {
  return request({
    url: '/device/archives/delete',
    method: 'post',
    data
  })
}

// 获取档案列表
export function getRecord(params) {
  return request({
    url: '/device/archives/list',
    method: 'get',
    params
  })
}

// 获取人员列表
export function getPerson(params) {
  return request({
    url: '/device/person/list',
    method: 'get',
    params
  })
}

// 添加/修改 人员
export function savePerson(data) {
  return request({
    url: '/device/person/save',
    method: 'post',
    data
  })
}

// 删除人员
export function delPerson(data) {
  return request({
    url: '/device/person/delete',
    method: 'post',
    data
  })
}

// 上传图片
export function uploadImage(data) {
  return request({
    url: '/file/upload/image',
    method: 'post',
    data
  })
}


// 模糊查询
export function getQuerySearch(params) {
  return request({
    url: `/device/person/selectByTrems`,
    method: 'get',
    params
  })
}

// 获取加油站下的算法服务器列表
export function serverList(params) {
  return request({
    url: `/device/algorithm/server/list`,
    method: 'get',
    params
  })
}

// 下发到布控
export function archivesControl(params) {
  return request({
    url: `/device/archives/control`,
    method: 'get',
    params
  })
}

// 获取加ai服务器下的摄像机
export function getLayerLists(params) {
  return request({
    url: `/device/camera/layer/lists`,
    method: 'get',
    params
  })
}

// 客户登记 添加
export function getStatisticss(params) {
  return request({
    url: `/device/customer/statistics/save`,
    method: 'post',
    data: params
  })
}

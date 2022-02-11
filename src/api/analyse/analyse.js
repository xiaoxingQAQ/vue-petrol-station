import request from '@/utils/request';

/* 智能分析 */

// 事件算法列表
export function getClassify(params) {
  return request({
      url: '/device/algorithm/list',
      method: 'get',
      params
  })
}

// 告警消息 智能分析列表
export function getWarningList(params) {
  return request({
    url: '/device/alarm/message/list',
    method: 'get',
    params
  })
}

// 告警处理
export function handleWarning(data) {
  return request({
    url: '/device/alarm/message/handle',
    method: 'post',
    data
  })
}

// 告警详情 /alarm/message/handle/{id}
export function getWarningDet(id) {
  return request({
    url: `/device/alarm/message/handle/${id}`,
    method: 'get',
  })
}


// 车辆抓拍数据
export function getCarList(params) {
  return request({
    url: '/device/car/capture/selects' ,
    method: 'get',
    params
  })
}

// 人脸抓拍数据
export function getFace(params) {
  return request({
    url: '/device/person/capture/selectFace' ,
    method: 'get',
    params
  })
}
// 名单布控 人脸抓拍信息和布控信息
export function getSelectByFace(params) {
  return request({
    url: '/device/face/warning/selectByFace' ,
    method: 'get',
    params
  })
}

// 名单预警 车辆抓拍信息和布控信息
export function getSelectCar(params) {
  return request({
    url: '/device/car/warning/selectCar',
    method: 'get',
    params
  })
}

// 获取人车轨迹信息
export function getPersontrackSelect(params) {
  return request({
    url: '/device/person/track/select' ,
    method: 'get',
    params
  })
}

// 查询在线用户
export function getSelectPerson() {
  return request({
    url: '/device/configuration/selectPerson' ,
    method: 'get',
  })
}

// 研判告警 查询
export function getJudgedSelect(params) {
  return request({
    url: '/device/judged/alarm/select',
    method: 'get',
    params
  })
}

// 研判告警 保存
export function getJudgedSave(data) {
  return request({
    url: '/device/judged​/alarm​/save',
    method: 'post',
    data
  })
}
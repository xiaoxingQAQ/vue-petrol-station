import request from '@/utils/request'
import api from '../index'
// 查询部门列表
export function listDept(query) {
  return request({
    url: '/system/dept/list',
    method: 'get',
    params: query
  })
}

// 获取告警信息
export function getAlarmEventCount() {
  return request({
    url: '/device/category/alarm/event/count',
    method: 'get'
  })
}

// 获取告警通知 echarts
export function getAlarmDegreeCount() {
  return request({
    url: '/device/category/alarm/degree/count',
    method: 'get'
  })
}

// 告警通知 初始化
export function getInform() {
  return request({
    url: '/device/alarm/message/new/day',
    method: 'get',
  })
}


// 任务通知 通知列表
export function getMessageList(params) {
  return request({
    url: '/device/task/list',
    method: 'get',
    params
  })
}

// 任务通知 油站发布任务
export function send(data) {
  return request({
    url: '/device/task/save',
    method: 'post',
    data
  })
}
// 获取司机任务详情
export function getTaskDetail(id) {
  return request({
    url: `/device/task/order/info/${id}`,
    method: 'get',
  })
}

/* --------------------------------------------- */

// 油站列表
export function getStationList(params = {}) {
  return request({
    url: api.home.station.list,
    method: 'get',
    params
  })
}

// 加油站站点图标 
export function getStationIcon(params) {
  return request({
    url: '/device/petrol/station/site',
    method: 'get',
    params
  })
}

// 添加加油站
export function addStation(data) {
  return request({
    url: '/device/petrol/station/marker',
    method: 'post',
    data
  })
}

// 删除加油站
export function unMarkerStation(params) {
  return request({
    url: '/device/petrol/station/unmarker',
    method: 'get',
    params
  })
}

// 查询地图站点信息列表
export function getPetrolStation(query) {
  return request({
    url: '/device/petrol/station/info',
    method: 'get',
    params: query
  })
}


// 查询地图中心点和缩放级别 传userId
export function getCenterLevel(params) {
  return request({
    url: '/device/configuration/select',
    method: 'get',
    params
  })
}

// 地图中心点和缩放级别 添加/修改 
/* 传 userId 
centreLongitude中心点经度  
centreLatitude中心点纬度  mapRank级别 */
export function addCenterLevel(data) {
  return request({
    url: '/device//configuration/saves',
    method: 'post',
    data
  })
}

// 按区域ID获取摄像机 图标列表
export function getCameraMarker(params) {
  return request({
    url: '/device/camera/selectByOrgId',
    method: 'get',
    params
  })
}

// 按ID获取摄像机列表信息
export function getCameraList(params) {
  return request({
    url: `/device/camera/list/server`,
    method: 'get',
    params
  })
}

// 添加 平面图摄像机
export function saveCamera(data) {
  return request({
    url: '/device/camera/save',
    method: 'post',
    data
  })
}

// 删除摄像机
export function deleteCamera(data) {
  return request({
    url: `/device/camera/deleteMap`,
    method: 'post',
    data
  })
}

/* 防区接口-------------------------- */
// 获取防区数据
export function getPolygonList(params) {
  return request({
    url: `/device/defence/area/select`,
    method: 'get',
    params
  })
}

// 添加 / 编辑 防区
export function savePolygon(data) {
  return request({
    url: '/device/defence/area/save',
    method: 'post',
    data
  })
}

// 删除区域
export function delPolygon(params) {
  return request({
    url: `/device/defence/area/delete`,
    method: 'delete',
    params
  })
}

// 油库处理任务
export function handleTask(data) {
  return request({
    url: `/device/task/order/handle`,
    method: 'post',
    data
  })
}

import request from '@/utils/request';

// 获取监控视频  /device/camera/list/server?orgId=
export function getVideo(params) {
  return request({
    url: `/device/camera/list/server`,
    method: 'get',
    params
  })
}
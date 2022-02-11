import request from '@/utils/request'

// 获取路由
export function getVideoStream(query) {
    return request({
        url: '/device/camera/video/stream',
        method: 'get',
        params: query
    })
}
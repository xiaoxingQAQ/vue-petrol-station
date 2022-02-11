import request from '@/utils/request'

// 登录方法
export function list(username, password, code, uuid) {
    return request({
        url: '/auth/login',
        method: 'post',
        data: { username, password, code, uuid }
    })
}
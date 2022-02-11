// const baseApi = 'http://192.168.2.74:9202'
// const baseApi = 'http://192.168.2.74:9122/device';
const baseApi = '/device';
const api = {
    home: {
        station: {
            list: baseApi + '/petrol/station/list'
        },
        dept: {
            list: baseApi + '/system/dept/list'
        }
    }
}

export default api
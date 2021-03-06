import Axios from "axios";
export function axiosUtil(config) {
  Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
  const instance = Axios.create({
    baseURL: 'api',
    timeout: 5000,
  })
  //响应拦截器
  instance.interceptors.response.use(res => {
    return res.data
  }, error => {
    console.log(error)
  })
  return instance(config);
}
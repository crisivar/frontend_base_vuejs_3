import axios from 'axios';
import urls from './urls';
import store from '@/store';

axios.defaults.baseURL = urls.SERVER_URL; // + urls.API_URL
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.xsrfCookieName = 'csrftoken';

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  async function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    const originalRequest = error.config;

    if (error.response.status === 401 && (originalRequest.url.includes('token/refresh/') || originalRequest.url.includes('token/'))) {
      store.dispatch('logout');
      return Promise.reject(error);
    } else if (error.response.status === 401 && !originalRequest._retry) {
      try {
        originalRequest._retry = true;

        const result = await axios({
          method: 'post',
          url: urls.API_AUTH_REFRESH_TOKEN,
          data: {
            refresh: store.state.user.refreshToken
          },
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (result.status === 200) {
          store.dispatch('setToken', result.data);
          originalRequest.headers.Authorization = 'Bearer ' + result.data.access;
          return axios(originalRequest);
        }
      } catch (_error) {
        if (_error.response && _error.response.data) {
          return Promise.reject(_error.response.data);
        }

        return Promise.reject(_error);
      }
    }

    if (error.response.status === 403 && error.response.data) {
      store.dispatch('logout');
      return Promise.reject(error.response.data);
    }

    store.dispatch('logout');
    return Promise.reject(error);
  }
);

const api = {
  get,
  post,
  patch,
  put,
  head,
  delete: _delete,
  postWithImages,
  putFile,
  postForDownload
};

async function performAxios(url, request, method, secured) {
  let headers = {
    'Content-Type': 'application/json'
  };

  if (secured) {
    let token = store.state.user.token;

    if (token) {
      headers = {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      };
    }
  }

  try {
    const response = await axios({
      method: method,
      url: url,
      data: request,
      headers: headers
    });
    return await Promise.resolve(response);
  } catch (error) {
    return await Promise.reject(error);
  }
}

function get(url, request, secured = true) {
  return performAxios(url, request, 'get', secured);
}

function post(url, request, secured = true) {
  return performAxios(url, request, 'post', secured);
}

function patch(url, request, secured = true) {
  return performAxios(url, request, 'patch', secured);
}

function put(url, request, secured = true) {
  return performAxios(url, request, 'put', secured);
}

function head(url, request) {
  return performAxios(url, request, 'head');
}

function _delete(url, request, secured = true) {
  return performAxios(url, request, 'delete', secured);
}

async function postWithImages(url, request, secured = true) {
  let headers = {
    'Content-Type': 'application/json'
  };

  if (secured) {
    let token = store.state.user.token;

    if (token) {
      headers = {
        Authorization: 'Bearer ' + token,
        'Content-Type': `multipart/form-data; boundary=${request._boundary}`
      };
    }
  }

  try {
    const response = await axios({
      method: 'post',
      url: url,
      data: request,
      headers: headers
    });
    return [response, null];
  } catch (error) {
    return [null, error];
  }
}

async function postForDownload(url, request, secured = true) {
  let headers = {
    'Content-Type': 'application/json'
  };

  if (secured) {
    let token = store.state.user.token;

    if (token) {
      headers = {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      };
    }
  }

  try {
    const response = await axios({
      method: 'post',
      url: url,
      data: request,
      headers: headers,
      responseType: 'blob'
    });
    const urlDownload = URL.createObjectURL(
      new Blob([response.data], {
        type: response.headers['content-type']
      })
    );
    const link = document.createElement('a');
    link.href = urlDownload;

    let filename = request.filename + '.xlsx';

    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    return [null, error];
  }
}

async function putFile(url, request, secured = true) {
  let headers = {
    'Content-Type': 'application/json'
  };

  if (secured) {
    let token = store.state.user.token;

    if (token) {
      headers = {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'multipart/form-data'
      };
    }
  }
  try {
    const response = await axios({
      method: 'put',
      url: url,
      data: request,
      headers: headers
    });
    return [response, null];
  } catch (error) {
    return [null, error];
  }
}

export default api;

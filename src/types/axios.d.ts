declare namespace Axios {
  interface AxiosXHRConfig<T> {
    url?: string;
    method?: string;
    baseURL?: string;
    headers?: any;
    params?: any;
    data?: T;
    timeout?: number;
    timeoutMessage?: string;
    withCredentials?: boolean;
    responseType?: string;
    onUploadProgress?: (progressEvent: any) => void;
    onDownloadProgress?: (progressEvent: any) => void;
    maxContentLength?: number;
    validateStatus?: (status: number) => boolean;
    maxRedirects?: number;
    httpAgent?: any;
    httpsAgent?: any;
  }

  interface AxiosXHR<T> {
    data: T;
    status: number;
    statusText: string;
    headers: any;
    config: AxiosXHRConfig<T>;
    request?: any;
  }
}
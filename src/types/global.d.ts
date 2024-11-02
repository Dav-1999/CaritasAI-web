declare global {
  /**
   * 响应数据
   */
  interface ResponseData<T = unknown> {
    data: T
    code: number
    msg: string
  }
}
export {}

import { HttpException, HttpStatus, Logger } from '@nestjs/common'
import { AxiosRequestConfig } from 'axios'
import { HttpService } from '@nestjs/axios'
import * as queryString from 'query-string'
import { catchError, lastValueFrom, map } from 'rxjs'

/* * Types/Interfaces for request/response utilities * */
export enum HttpRequestMethods {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'delete',
}

export enum ContentType {
  JSON = 'JSON',
  FORM = 'FORM',
}

export interface HttpRequestHeaders {
  [key: string]: string
}

export interface HttpResponseBody {
  message?: string
  data?: any

  [key: string]: any
}

namespace HttpUtils {
  export const httpService = new HttpService()
  const logger = new Logger()

  /**
   * Make pure HTTP requests with full of customizations
   *
   * @param method HTTP methods
   * @param url Destination URL
   * @param data Request Data
   * @param headers Request Headers
   * @param type Request content type
   * @returns
   */
  export const makeHttpRequest = async (
    method: HttpRequestMethods,
    url: string,
    data: any,
    headers?: HttpRequestHeaders,
    type = ContentType.JSON,
  ) => {
    // Init Axios configurations
    const config: AxiosRequestConfig = {
      method,
      url,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    }

    // Parse query for GET and DELETE methods else retain original payload
    if (data) {
      const paramsText = queryString.stringify(data, { arrayFormat: 'bracket' })
      if (
        method === HttpRequestMethods.GET ||
        method === HttpRequestMethods.DELETE
      ) {
        config.url = `${url}?${paramsText}`
      } else if (
        method === HttpRequestMethods.POST ||
        method === HttpRequestMethods.PUT ||
        method === HttpRequestMethods.PATCH
      ) {
        if (type === ContentType.FORM) {
          config.data = paramsText
        } else {
          config.data = data
        }
      }
    }

    // Append request headers if available
    if (headers) {
      config.headers = headers
    }
    const user = config.headers['x-user-id'] || 'Anonymous'
    logger.log(
      JSON.stringify(config),
      `HTTP Request - userId: ${user}${
        headers?.requestId ? ' - requestId: ' + headers.requestId : ''
      }`,
    )

    // Make HTTP request
    return lastValueFrom(
      httpService.request(config).pipe(
        // Transform response data
        map((response) => {
          if (response.data.errors && response.data.errors[0]) {
            logger.error(response.data.errors[0].message)
            throw new HttpException(
              'Something went wrong',
              response.data.errors[0].statusCode,
            )
          }
          logger.log(JSON.stringify(response.data), 'HTTP Response')
          return response.data
        }),
        // Handle errors
        catchError((error) => {
          logger.error(error.message, error.stack)

          // Get response body
          const responseBody = error.response?.data || {}

          // Throw error to be handled by caller
          throw new HttpException(
            responseBody.error || responseBody.errorMessage || error.message,
            error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
          )
        }),
      ),
    )
  }

  /**
   * Make HTTP request with application/json content type
   *
   * @param method HTTP Methods
   * @param url Destination URL
   * @param data Request Data
   * @param headers Request Headers
   * @returns
   */
  export const makeJsonRequest = (
    method: HttpRequestMethods,
    url: string,
    data: any,
    headers?: HttpRequestHeaders,
  ) => {
    const jsonHeaders = {
      ...headers,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }

    return makeHttpRequest(method, url, data, jsonHeaders)
  }

  /**
   * Make HTTP request with application/x-www-form-urlencoded content type
   *
   * @param method HTTP Methods
   * @param url Destination URL
   * @param data Request Data
   * @param headers Request Headers
   * @returns
   */
  export const makeFormRequest = (
    method: HttpRequestMethods,
    url: string,
    data: any,
    headers?: HttpRequestHeaders,
  ) => {
    const jsonHeaders = {
      ...headers,
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    }

    return makeHttpRequest(method, url, data, jsonHeaders, ContentType.FORM)
  }

  /**
   *  Make multipart requests for files, streams of data, etc.
   *
   * @param method HTTP Methods
   * @param url Destination URL
   * @param data Request Data
   * @param headers Request Headers
   * @returns
   */
  export const makeMultipartRequest = (
    method: HttpRequestMethods,
    url: string,
    data: any,
    headers?: HttpRequestHeaders,
  ) => {
    const multipartHeaders = {
      ...headers,
      'Content-Type': 'multipart/form-data',
    }
    return makeHttpRequest(method, url, data, multipartHeaders)
  }

  /**
   *  Issue a GET request to specified url
   *
   * @param path Path or URL to request destination
   * @param data Request data on query string variables
   * @param headers Request headers
   * @returns JSON Response
   */
  export const getJson = (
    path: string,
    data: any,
    headers?: HttpRequestHeaders,
  ) => makeJsonRequest(HttpRequestMethods.GET, path, data, headers)

  /**
   * Issue a POST request to specified url
   *
   * @param path Path or URL to request destination
   * @param data Request data on in JSON format
   * @param headers Request headers
   * @returns JSON Response
   */
  export const postJson = (
    path: string,
    data: any,
    headers?: HttpRequestHeaders,
  ) => makeJsonRequest(HttpRequestMethods.POST, path, data, headers)

  /**
   * Issue a PUT request to specified url
   *
   * @param path Path or URL to request destination
   * @param data Request data on in JSON format
   * @param headers Request headers
   * @returns JSON Response
   */
  export const putJson = (
    path: string,
    data: any,
    headers?: HttpRequestHeaders,
  ) => makeJsonRequest(HttpRequestMethods.PUT, path, data, headers)

  /**
   * Issue a PUT request to specified url
   *
   * @param path Path or URL to request destination
   * @param data Request data on in JSON format
   * @param headers Request headers
   * @returns JSON Response
   */
  export const patchJson = (
    path: string,
    data: any,
    headers?: HttpRequestHeaders,
  ) => makeJsonRequest(HttpRequestMethods.PATCH, path, data, headers)

  /**
   * Issue a POST request to specified url
   *
   * @param path Path or URL to request destination
   * @param data Request data on query string variables
   * @param headers Request headers
   * @returns JSON Response
   */
  export const deleteJson = (
    path: string,
    data: any,
    headers?: HttpRequestHeaders,
  ) => makeJsonRequest(HttpRequestMethods.DELETE, path, data, headers)

  /**
   *  Issue a GET request to specified url
   *
   * @param path Path or URL to request destination
   * @param data Request data on query string variables
   * @param headers Request headers
   * @returns JSON Response
   */
  export const getForm = (
    path: string,
    data: any,
    headers?: HttpRequestHeaders,
  ) => makeFormRequest(HttpRequestMethods.GET, path, data, headers)

  /**
   * Issue a POST request to specified url
   *
   * @param path Path or URL to request destination
   * @param data Request data on in JSON format
   * @param headers Request headers
   * @returns JSON Response
   */
  export const postForm = (
    path: string,
    data: any,
    headers?: HttpRequestHeaders,
  ) => makeFormRequest(HttpRequestMethods.POST, path, data, headers)

  /**
   * Issue a PUT request to specified url
   *
   * @param path Path or URL to request destination
   * @param data Request data on in JSON format
   * @param headers Request headers
   * @returns JSON Response
   */
  export const putForm = (
    path: string,
    data: any,
    headers?: HttpRequestHeaders,
  ) => makeFormRequest(HttpRequestMethods.PUT, path, data, headers)

  /**
   * Issue a PUT request to specified url
   *
   * @param path Path or URL to request destination
   * @param data Request data on in JSON format
   * @param headers Request headers
   * @returns JSON Response
   */
  export const patchForm = (
    path: string,
    data: any,
    headers?: HttpRequestHeaders,
  ) => makeFormRequest(HttpRequestMethods.PATCH, path, data, headers)

  /**
   * Issue a POST request to specified url
   *
   * @param path Path or URL to request destination
   * @param data Request data on query string variables
   * @param headers Request headers
   * @returns JSON Response
   */
  export const deleteForm = (
    path: string,
    data: any,
    headers?: HttpRequestHeaders,
  ) => makeFormRequest(HttpRequestMethods.DELETE, path, data, headers)

  /**
   * Issue a POST multipart request to specified url
   *
   * @param path Path or URL to request destination
   * @param data Request data of FormData format
   * @param headers Request headers
   * @returns JSON Response
   */
  export const postMultipartForm = (
    path: string,
    data: any,
    headers?: HttpRequestHeaders,
  ) => makeMultipartRequest(HttpRequestMethods.POST, path, data, headers)

  export const SuccessResponse = {
    message: 'Successfully',
    status: 200,
  }
}

export { HttpUtils }

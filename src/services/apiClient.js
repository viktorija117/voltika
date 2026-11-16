// The only module that knows where the product API lives.
const API_BASE_URL = 'https://dummyjson.com'

/** Error with an HTTP status, so views can tell "not found" (404) from "try again" (0, 5xx). */
export class ApiError extends Error {
  /**
   * @param {string} message
   * @param {number} status HTTP status, or 0 when the request never reached the server.
   */
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/**
 * True when a request was cancelled on purpose (AbortController), which is not an error to show.
 * @param {unknown} error
 * @returns {boolean}
 */
export function isAbortError(error) {
  return error instanceof DOMException && error.name === 'AbortError'
}

/**
 * GETs a JSON resource from the API.
 * @param {string} path Path with query string, e.g. "/products/1".
 * @param {{ signal?: AbortSignal }} [options]
 * @returns {Promise<any>} Parsed JSON body.
 * @throws {ApiError} On network failure or a non-2xx response. Aborts are rethrown unchanged.
 */
export async function fetchJson(path, { signal } = {}) {
  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { signal })
  } catch (error) {
    if (isAbortError(error)) throw error
    throw new ApiError('Network request failed', 0)
  }
  if (!response.ok) {
    throw new ApiError(`Request failed with status ${response.status}`, response.status)
  }
  return response.json()
}

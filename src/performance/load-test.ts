/**
 * This function will be called by k6 when the test is run  
 * It will make a GET request to the /api/posts endpoint  
 * It will check that the response code is 200
 */
import { check } from 'k6'
import http from 'k6/http'

/**
 * @description  
 * Load test options for the /api/posts endpoint  
 * Thresholds are defined to ensure that the error rate is less than 1% and 99% of requests are below 1s  
 * This test will make a GET request to the /api/posts endpoint  
 */
export const options = {
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(99)<1000'],
  },
}

export default function () {
  const url = 'http://localhost:80/api/posts'

  const res = http.get(url)

  check(res, {
    'response code was 200': (res) => res.status == 200,
  })
}

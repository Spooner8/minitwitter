/**
 * This function will be called by k6 when the test is run
 * It will make a GET request to the /api/posts endpoint
 * It will check that the response code is 200
 */

import { check } from 'k6'
import http from 'k6/http'

/**
 * @description  
 * Stress test options for the /api/posts endpoint  
 * Stages are defined to ramp up the number of virtual users from 10 to 2000 over 3 minutes  
 * Thresholds are defined to ensure that the error rate is less than 1% and 99% of requests are below 1s  
 */
export const options = {
  thresholds: {
    http_req_failed: [{ threshold: 'rate<0.01', abortOnFail: true }],
    http_req_duration: [{ threshold: 'p(99)<1000', abortOnFail: true }],
  },
  scenarios: {
    breaking: {
      executor: 'ramping-vus',
      stages: [
        { duration: '10s', target: 10 },
        { duration: '20s', target: 20 },
        { duration: '20s', target: 50 },
        { duration: '20s', target: 100 },
        { duration: '20s', target: 200 },
        { duration: '50s', target: 500 },
        { duration: '50s', target: 1000 },
        { duration: '50s', target: 2000 },
      ],
    },
  },
}

export default function () {
  const url = 'http://localhost:80/api/posts'
  const res = http.get(url)

  check(res, {
    'response code was 200': (res) => res.status == 200,
  })
}

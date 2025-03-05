import { check } from 'k6'
import http from 'k6/http'

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

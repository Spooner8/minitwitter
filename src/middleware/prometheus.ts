import promMid from 'express-prometheus-middleware';

export const prometheus = promMid({
    metricsPath: '/metrics',
    collectDefaultMetrics: false,
    requestDurationBuckets: [0.1, 0.5, 1, 1.5],
    requestLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
    responseLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
});

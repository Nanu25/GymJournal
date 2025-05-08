# Performance Testing with JMeter

This directory contains JMeter test plans for performance testing the Training App API endpoints.

## Prerequisites

1. Install JMeter (version 5.6.2 or later)
   - Download from: https://jmeter.apache.org/download_jmeter.cgi
   - Extract the downloaded archive
   - Add JMeter's bin directory to your system PATH

2. Ensure your application is running locally on port 3000

## Test Plan Overview

The test plan (`load-test.jmx`) includes the following scenarios:

1. Login Request
   - Simulates user authentication
   - Extracts JWT token for subsequent requests

2. Get All Trainings
   - Retrieves all training records
   - Requires authentication

3. Get Muscle Group Distribution
   - Retrieves analytics data
   - Requires authentication

## Test Configuration

The test plan is configured with:
- 50 concurrent users
- 100 loops per user
- 10-second ramp-up time
- 5-minute test duration

## Running the Tests

1. Start your application:
```bash
npm start
```

2. Run the JMeter test plan:
```bash
jmeter -n -t load-test.jmx -l results.jtl -e -o report
```

Parameters:
- `-n`: Run in non-GUI mode
- `-t`: Test plan file
- `-l`: Results file
- `-e`: Generate HTML report
- `-o`: Output directory for HTML report

## Analyzing Results

After the test completes, you can find:
1. Detailed results in `results.jtl`
2. HTML report in the `report` directory

Key metrics to analyze:
- Response time (min, max, average)
- Throughput (requests per second)
- Error rate
- 90th and 95th percentile response times

## Performance Targets

The following are recommended performance targets:
- Average response time < 200ms
- 95th percentile response time < 500ms
- Error rate < 1%
- Throughput > 50 requests/second

## Troubleshooting

1. If you get connection errors:
   - Verify the application is running
   - Check if the port (3000) is correct
   - Ensure no firewall is blocking the connection

2. If you get authentication errors:
   - Verify the test user credentials
   - Check if the JWT token extraction is working

3. If JMeter fails to start:
   - Verify JAVA_HOME is set correctly
   - Ensure you have sufficient system resources 
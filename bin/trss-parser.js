#!/usr/bin/env node
'use strict';

const request = require('request');
const syncRequest = require('sync-request');

let PARENT_ID
let BUILD_URL
let STARTED_BY
let MARKDOWN_TEMPLATE

if (! process.argv[2]) {
    console.error("ERROR: Please specify the parent ID")
    process.exit(1)
} else {
    PARENT_ID = process.argv[2];
}

request(`https://trss.adoptopenjdk.net/api/getParents?id=${PARENT_ID}`, { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    MARKDOWN_TEMPLATE = `TRSS [link](https://trss.adoptopenjdk.net/buildDetail?parentId=${PARENT_ID}&testSummaryResult=failed&buildNameRegex=%5ETest) \n`
    BUILD_URL = body[0].buildUrl
    STARTED_BY = body[0].startBy
    MARKDOWN_TEMPLATE += `Build URL ${BUILD_URL} \nStarted by ${STARTED_BY} \n`

    const buildNameRegex = "^Test_openjdk.*";

    request(`https://trss.adoptopenjdk.net/api/getBuildHistory?parentId=${PARENT_ID}`, { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }

        for (let build of body) {
            if (build.buildResult != "SUCCESS") {
                MARKDOWN_TEMPLATE += `### ⚠️  [${build.buildName}](${build.buildUrl}) has a build result of ${build.buildResult} ⚠️\n`
            }
        }
        
        request(`https://trss.adoptopenjdk.net/api/getAllChildBuilds?parentId=${PARENT_ID}&buildNameRegex=${buildNameRegex}`, { json: true }, (err, res, body) => {
            if (err) { return console.log(err); }
            for (let testGroup of body) {
                if (testGroup.buildResult !== "SUCCESS") {
                    let TEST_GROUP_NAME = testGroup.buildName
                    let TEST_GROUP_URL = testGroup.buildUrl
                    MARKDOWN_TEMPLATE += `\n[**${TEST_GROUP_NAME}**](${TEST_GROUP_URL}) \n`
                    if (testGroup.tests) {
                        for (let test of testGroup.tests) {
                            if (test.testResult === "FAILED") {
                                let TEST_NAME = test.testName
                                let TEST_ID = test._id
                                let historyLink = syncRequest('GET', `https://trss.adoptopenjdk.net/api/getHistoryPerTest?testId=${TEST_ID}&limit=100`)
                                var history = JSON.parse(historyLink.getBody('utf8'));
                                let TOTAL_RUNS = 0
                                let TOTAL_PASSES = 0
                                for (let testRun of history) {
                                    TOTAL_RUNS += 1
                                    if (testRun.tests.testResult === "PASSED") {
                                        TOTAL_PASSES += 1
                                    }
                                }
                                MARKDOWN_TEMPLATE += `${TEST_NAME} => [deep history ${TOTAL_PASSES}/${TOTAL_RUNS} passed](https://trss.adoptopenjdk.net/deepHistory?testId=${TEST_ID}) \n`
                            }
                        }
                    }
                }
            }   
            console.log(MARKDOWN_TEMPLATE)
        });
    });
});


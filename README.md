# TRSS Parser
trss-parser is a simple tool for generating a markdown issue used as part of triaging.

[Test Results Summary Service (TRSS)](https://trss.adoptopenjdk.net) is a tool created by [AdoptOpenJDK](https://adoptopenjdk.net) to help with test triaging.

## Installation
```bash
npm install -g trss-parser
```

## Usage
```bash
trss-parser <parentId> # Where parentID comes from https://trss.adoptium.net/
```

### Example
```bash
$ trss-parser 5f60dc9a11d26031c17a9f11

TRSS [link](https://trss.adoptium.net/buildDetail?parentId=5f60dc9a11d26031c17a9f11&testSummaryResult=failed&buildNameRegex=%5ETest) 
Build URL https://ci.adoptopenjdk.net/job/build-scripts/job/openjdk15-pipeline/282/ 
Started by user George Adams 

[**Test_openjdk15_hs_sanity.openjdk_aarch64_linux**](https://ci.adoptopenjdk.net/job/Test_openjdk15_hs_sanity.openjdk_aarch64_linux/48/) 
jdk_lang_0 => [deep history 6/27 passed](https://trss.adoptium.net/deepHistory?testId=5f60f83711d26031c17ab408) 
jdk_util_0 => [deep history 6/27 passed](https://trss.adoptium.net/deepHistory?testId=5f60f83711d26031c17ab406) 

[**Test_openjdk15_hs_special.functional_x86-64_linux**](https://ci.adoptopenjdk.net/job/Test_openjdk15_hs_special.functional_x86-64_linux/46/) 
MBCS_Tests_unicode_linux_0 => [deep history 0/27 passed](https://trss.adoptium.net/deepHistory?testId=5f60f82e11d26031c17ab245) 
MBCS_Tests_codepoint_linux_0 => [deep history 0/27 passed](https://trss.adoptium.net/deepHistory?testId=5f60f82e11d26031c17ab177) 
```

The resulting text can the be pasted into a GitHub [Promote Release template](https://github.com/AdoptOpenJDK/TSC/issues/new/choose).

## How to find the parentId
Go to https://trss.adoptium.net/ and select a pipeline run that you are triaging.
This will take you to a new page such as:
```
https://trss.adoptium.net/buildDetail?parentId=5f60f57611d26031c17aac90
```

The parentId is the last part of the URL.
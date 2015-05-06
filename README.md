# AviPost
[![Circle CI](https://circleci.com/gh/yarray/AviPost.web.svg?style=svg)](https://circleci.com/gh/yarray/AviPost.web)

Web app version of AviPost. Please refer to sunforest/AviPost as backend.

## Development

Preparation:

1. Install node + npm
2. Install gulp globally with ``` sudo npm install -g gulp ```
3. Install other dependencies with ``` npm install ``` under the root directory

Now you have a bunch of tasks available:

* ``` gulp serve ``` set up a dev server with auto compilation on code change *
* ``` gulp build ``` build for production
* ``` gulp test ``` run unit tests
* ``` gulp clean ``` clean generated files

Please refer to gulpfile.js to find other smaller tasks.

\* **Notice**: The server initialized by ```gulp serve``` needs a fake backend, which can be start up by invoking ``` node server.js ``` under dev/

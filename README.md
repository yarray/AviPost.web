# AviPost
[![Circle CI](https://img.shields.io/circleci/project/yarray/AviPost.web.svg?style=svg)](https://circleci.com/gh/yarray/AviPost.web)

Web app version of AviPost. Please refer to [sunforest/AviPost](https://github.com/sunForest/AviPost) as backend.

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

\* **Notice**: The server initialized by ```gulp serve``` needs a backend. If you cannot connect to a proper running backend, you can it by following 
Quick & dirty steps (be careful it is **NOT** best practice and may pollute your system):

1. Install & init PostgreSQL and PostGIS
2. Install Docker, also install & start boot2docker if you are on OS X
3. Checkout submodule: ``` git submodule sync && git submodule update --init ```
4. ``` docker build -t avipost AviPost/ ```
5. ``` createdb avipost_ci ```
6. ``` psql -U postgres -c "CREATE EXTENSION postgis -d avipost_ci" ```
7. ``` python AviPost/avipost/manage.py migrate ```
8. ``` docker run --name=api --net='host' -e "DJANGO_SETTINGS_MODULE=avipost.settings.ci_stubbed_prod" -d avipost ```

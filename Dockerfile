FROM nginx

MAINTAINER yarray

ADD . /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]

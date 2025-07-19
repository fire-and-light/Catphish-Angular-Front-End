FROM nginx:stable-alpine
COPY dist/front-end /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]

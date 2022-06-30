<p align="center">
  <a href="https://www.weishour.com/" target="blank"><img src="https://github.com/weishour/wsbm-frontend/raw/main/src/assets/images/logo/weishour.svg" width="220" alt="WeiShour Logo" /></a>
</p>

## 描述

[WSBM]() 唯守书签后端项目。

## 安装

```bash
$ npm install
```

## 配置

```bash
$ cp .env.example .env
```

## 开发

```bash
# 快速生成CRUD资源 (REST API / GraphQL / Microservice / WebSockets)
$ nest g resource xxx --no-spec
```

## 运行

```bash
# 开发
$ npm run start

# 观察模式
$ npm run dev

# 产品模式
$ npm run prod
```

## pm2 部署

```bash
$ npm run pm2
```

## 文档

```bash
$ npm run doc
```

## Nginx 配置 (例)

```
server {
    listen       80;
    server_name  server.weishour.com;

    location / {
        proxy_pass        http://127.0.0.1:3000;
        proxy_set_header  X-Real-IP $remote_addr;
        proxy_set_header  X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header  Host $http_host;
        proxy_set_header  X-Nginx-Proxy true;
        proxy_redirect    off;
    }
}
```

# TODO API

Simple TODO API utilizing Express, Knex and PostgreSQL.

## How to start

(A running DB with an existing DB named `todo` on `localhost:5432` is necessary.)

* Without docker

```
yarn install
yarn start
```

* With docker

```
docker build -t todo-api .
docker run -p 3000:3000 -d todo-api
```

* (Under construction) With docker-compose

```
docker-compose up -d
```

## (Under construction) API documentation

* Refer to `localhost:3000`
* Note: API documentation is auto generated by [pretty-swag](https://twskj.github.io/pretty-swag/).

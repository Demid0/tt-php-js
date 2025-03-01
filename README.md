## Stack
- PHP
- JS
- PostgreSQL

## Start server
```shell
cd public
php -S localhost:8000
```

## DDL
```postgresql
create table checks (
    id serial primary key,
    datetime varchar(255),
    checkedText text,
    lang varchar(10)
);
```

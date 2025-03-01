## Stack
- PHP
- JS
- PostgreSQL

## Create .env as in .env.example

## DDL
```postgresql
create table checks (
    id serial primary key,
    datetime varchar(255),
    checkedText text,
    lang varchar(10)
);
```

## How to run
```shell
composer install
npm install
cd public
php -S localhost:8000
```
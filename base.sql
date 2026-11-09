create database CellStore;
go

use CellStore;
go

-- ===== Catálogo =====
create table celulares (
    id int identity(1,1) primary key,
    marca varchar(50) not null,
    modelo varchar(100) not null,
    precio decimal(10,2) not null,
    stock int not null default 0
);
go

insert into celulares (marca, modelo, precio, stock)
values
('Samsung', 'Galaxy A55', 7499.00, 10),
('Apple', 'iPhone 13', 9999.00, 5),
('Xiaomi', 'Redmi Note 13', 4299.00, 12),
('Motorola', 'Moto G85', 4999.00, 8);
go

-- ===== Usuarios =====
create table usuarios (
    id int identity(1,1) primary key,
    nombre varchar(100) not null,
    email varchar(100) not null unique,
    password varchar(100) not null,
    rol varchar(10) not null default 'usuario'
);
go

-- ===== Pedidos =====
create table pedidos (
    id int identity(1,1) primary key,
    usuario_id int not null foreign key references usuarios(id),
    fecha datetime not null default getdate(),
    total decimal(10,2) not null default 0
);
go

create table detalle_pedido (
    id int identity(1,1) primary key,
    pedido_id int not null foreign key references pedidos(id),
    celular_id int not null foreign key references celulares(id),
    cantidad int not null,
    precio_unitario decimal(10,2) not null
);
go

select * from celulares;
go
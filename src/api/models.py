from datetime import datetime
from typing import List
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(primary_key = True)
    email: Mapped[str] = mapped_column(String(120), unique = True, nullable = False)
    password: Mapped[str] = mapped_column(String(400), nullable = False)
    name: Mapped[str] = mapped_column(String(80), nullable = False)
    lastname: Mapped[str] = mapped_column(String(80), nullable = True)

    products: Mapped[List["Product"]] = relationship(secondary = "sale_detail", back_populates = "users")
    shops: Mapped[List["Shop"]] = relationship(secondary = "sale_detail", back_populates = "users")

class Product(db.Model):
    __tablename__ = "product"

    id: Mapped[int] = mapped_column(primary_key = True)
    name: Mapped[str] = mapped_column(String(80), nullable = False)
    price: Mapped[float] = mapped_column(Float, nullable = False)

    users: Mapped[List["User"]] = relationship(secondary = "sale_detail", back_populates = "products")
    shops: Mapped[List["Shop"]] = relationship(secondary = "sale_detail", back_populates = "products")

    shop_inventory: Mapped[List["Shop"]] = relationship(secondary = "inventory", back_populates = "products_qty")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "price": self.price
        }

class Shop(db.Model):
    __tablename__ = "shop"

    id: Mapped[int] = mapped_column(primary_key = True)
    name: Mapped[str] = mapped_column(String(100), nullable = False)
    location: Mapped[str] = mapped_column(String(100), nullable = True)

    users: Mapped[List["User"]] = relationship(secondary = "sale_detail", back_populates = "shops")
    products: Mapped[List["Product"]] = relationship(secondary = "sale_detail", back_populates = "shops")

    products_qty: Mapped[List["Product"]] = relationship(secondary = "inventory", back_populates = "shop_inventory")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "location": self.location
        }

class Sale(db.Model):
    __tablename__ = "sale"

    id: Mapped[int] = mapped_column(primary_key = True)
    created_date: Mapped[datetime] = mapped_column(DateTime, nullable = False, server_default = func.now())

    sale_detail: Mapped[List["Sale_Detail"]] = relationship(back_populates = "sale")

class Sale_Detail(db.Model):
    __tablename__ = "sale_detail"

    id: Mapped[int] = mapped_column(primary_key = True)
    qty: Mapped[int] = mapped_column(Integer, nullable = False)

    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable = False)
    product_id: Mapped[int] = mapped_column(ForeignKey("product.id"), nullable = False)
    shop_id: Mapped[int] = mapped_column(ForeignKey("shop.id"), nullable = False)
    sale_id: Mapped[int] = mapped_column(ForeignKey("sale.id"), nullable = False)

    sale: Mapped["Sale"] = relationship(back_populates = "sale_detail")

class Inventory(db.Model):
    __tablename__ = "inventory"

    id: Mapped[int] = mapped_column(primary_key = True)
    qty: Mapped[int] = mapped_column(Integer, nullable = False)

    product_id: Mapped[int] = mapped_column(ForeignKey("product.id"), nullable = False)
    shop_id: Mapped[int] = mapped_column(ForeignKey("shop.id"), nullable = False)

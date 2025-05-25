"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import request, jsonify, Blueprint
from api.models import Product, Sale, Sale_Detail, Shop, db, User
from flask_cors import CORS
from flask_bcrypt import generate_password_hash, check_password_hash
from sqlalchemy import select
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

# Start: Endpoints
@api.route('/user', methods = ['POST'])
def register_user():
    body = request.get_json(silent = True)

    if body is None:
        return { "message": "Debes enviarme el body" }, 404
    
    if 'email' not in body or 'password' not in body or 'name' not in body:
        return { "message": "Datos incompletos" }, 404
    
    new_lastname = ''
    if 'lastname' in body:
        new_lastname = body['lastname']
    
    new_pwd = generate_password_hash(body['password']).decode('utf-8')

    user = User(email = body['email'], password = new_pwd, name = body['name'], lastname = new_lastname)
    db.session.add(user)
    db.session.commit()

    return { "message": "El usuario ha sido registrado exitosamente" }, 200
    
@api.route('/token', methods = ['POST'])
def create_login():
    body = request.get_json(silent = True)
    
    if body is None:
        return { "message": "Debes enviarme un body" }, 404
    
    if 'email' not in body or 'password' not in body:
        return { "message": "Datos incompletos" }, 404
    
    user = db.session.execute(select(User).where(User.email == body['email'])).scalar_one_or_none()
    if user is None:
        return { "message": "El usuario no existe" }, 404

    if not check_password_hash(user.password, body['password']):
        return { "message": "Usuario o contraseña no válida" }, 404
    
    access_token = create_access_token(identity = user.id)
    return { "token": access_token, "user_id": user.id }, 200

@api.route('/shops')
def get_all_shops():
    all_shops = db.session.execute(select(Shop)).scalars().all()
    all_shops = list(map(lambda shop: shop.serialize(), all_shops))

    return { "shops": all_shops }, 200

@api.route('/shops/<int:shop_id>/products')
def get_shop_products(shop_id):
    shop = db.session.execute(select(Shop).where(Shop.id == shop_id)).scalar_one_or_none()

    if shop is None:
        return { "message": "La tienda no existe" }, 404
    
    products = []
    for product in shop.products_qty:
        products.append(product.serialize())

    return { "products": products }, 200

@api.route('/sale', methods = ['POST'])
@jwt_required()
def make_sale():
    body = request.get_json(silent = True)

    if body is None:
        return { "message": "Debes enviarme los productos para la compra" }, 404
    
    if 'products' not in body:
        return { "message": "No hay productos en el carrito" }, 404
    
    user_id = get_jwt_identity()
    user = db.session.execute(select(User).where(User.id == user_id)).scalar_one_or_none()

    if user is None:
        return { "message": "El usuario no existe" }, 404

    sale = Sale()
    db.session.add(sale)
    db.session.commit()

    for product in body['products']:
        sale_detail = Sale_Detail(user_id = user_id, product_id = product['product_id'], shop_id = product['shop_id'], sale_id = sale.id, qty = product['qty'])
        sale.sale_detail.append(sale_detail)

    db.session.commit()
    return { "message": "Se ha creado la compra exitosamente", "sale_id": sale.id }, 200

@api.route('/sale/<int:sale_id>')
@jwt_required()
def get_sale(sale_id):
    sale = db.session.execute(select(Sale).where(Sale.id == sale_id)).scalar_one_or_none()

    if sale is None:
        return { "message": "La compra no existe" }, 404
    
    products = []
    for detail in sale.sale_detail:
        det = {
            "product": db.session.execute(select(Product).where(Product.id == detail.product_id)).scalar_one_or_none().serialize(),
            "shop": db.session.execute(select(Shop).where(Shop.id == detail.shop_id)).scalar_one_or_none().serialize(),
            "qty": detail.qty
        }
        products.append(det)

    return { "sale_detail": products }, 200
# End: Endpoints
  
import os
from flask_admin import Admin
from .models import db, User, Product, Shop, Sale, Inventory
from flask_admin.contrib.sqla import ModelView

class Inventory_Model(ModelView):
    column_list = ('product_id', 'shop_id', "qty")
    form_columns = ('product_id', 'shop_id', "qty")

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    
    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(Product, db.session))
    admin.add_view(ModelView(Shop, db.session))
    admin.add_view(ModelView(Sale, db.session))
    admin.add_view(Inventory_Model(Inventory, db.session))

    # You can duplicate that line to add mew models
    # admin.add_view(ModelView(YourModelName, db.session))
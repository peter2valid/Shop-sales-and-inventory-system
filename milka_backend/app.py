"""
Milka Shop Juja - POS Backend API
Flask backend for managing products, sales, and payments
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.utils import secure_filename
from datetime import datetime
import os
from db_config import get_db_connection, get_connection, close_db_connection

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

# Create uploads directory if it doesn't exist
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size


def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"message": "Milka POS API running ✅"})


@app.route('/products', methods=['GET'])
def get_products():
    """Fetch all products ordered by id DESC"""
    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({"error": "Database connection failed"}), 500

        cursor = connection.cursor(dictionary=True)
        query = "SELECT * FROM products ORDER BY id DESC"
        cursor.execute(query)
        products = cursor.fetchall()

        # Convert Decimal to float for JSON serialization
        for product in products:
            if 'price_each' in product and product['price_each'] is not None:
                product['price_each'] = float(product['price_each'])
            if 'price_total' in product and product['price_total'] is not None:
                product['price_total'] = float(product['price_total'])

        return jsonify({"products": products}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        close_db_connection(connection, cursor)


@app.route('/products', methods=['POST'])
def add_product():
    """Add a new product with image upload"""
    connection = None
    cursor = None
    try:
        # Get form data
        name = request.form.get('name')
        brand = request.form.get('brand')
        category = request.form.get('category')
        quantity = request.form.get('quantity')
        price_each = request.form.get('price_each')

        # Validate required fields
        if not all([name, brand, category, quantity, price_each]):
            return jsonify({"error": "Missing required fields"}), 400

        try:
            quantity = int(quantity)
            price_each = float(price_each)
        except ValueError:
            return jsonify({"error": "Invalid quantity or price format"}), 400

        # Calculate price_total
        price_total = quantity * price_each

        # Handle image upload
        image_path = None
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename != '' and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                # Add timestamp to avoid filename conflicts
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S_')
                filename = timestamp + filename
                image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(image_path)
                # Store relative path for database
                image_path = os.path.join(UPLOAD_FOLDER, filename)

        # Insert into database
        connection = get_db_connection()
        if not connection:
            return jsonify({"error": "Database connection failed"}), 500

        cursor = connection.cursor()
        
        query = """
            INSERT INTO products (name, brand, category, quantity, price_each, price_total, image, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, NOW())
        """
        values = (name, brand, category, quantity, price_each, price_total, image_path)
        
        cursor.execute(query, values)
        connection.commit()

        product_id = cursor.lastrowid
        return jsonify({
            "message": "Product added successfully",
            "product_id": product_id
        }), 201

    except Exception as e:
        if connection:
            connection.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        close_db_connection(connection, cursor)


@app.route('/sales', methods=['GET'])
def get_sales():
    """Fetch all sales ordered by sold_at DESC"""
    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({"error": "Database connection failed"}), 500

        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM sales ORDER BY sold_at DESC")
        sales = cursor.fetchall()

        # Convert Decimal to float for JSON serialization
        for sale in sales:
            if 'price_each' in sale and sale['price_each'] is not None:
                sale['price_each'] = float(sale['price_each'])
            if 'total' in sale and sale['total'] is not None:
                sale['total'] = float(sale['total'])
            if 'quantity' in sale and sale['quantity'] is not None:
                sale['quantity'] = int(sale['quantity'])

        return jsonify(sales), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        close_db_connection(connection, cursor)


@app.route('/sales', methods=['POST'])
def record_sale():
    db = get_connection()
    cursor = db.cursor()

    product_id = request.json['product_id']
    product_name = request.json['product_name']
    quantity = request.json['quantity']
    price_each = request.json['price_each']
    total = request.json['total']
    sold_by = request.json['sold_by']

    cursor.execute("""
        INSERT INTO sales (product_id, product_name, quantity, price_each, total, sold_by)
        VALUES (%s,%s,%s,%s,%s,%s)
    """, (product_id, product_name, quantity, price_each, total, sold_by))

    cursor.execute("UPDATE products SET quantity = quantity - %s WHERE id = %s", (quantity, product_id))

    db.commit()
    db.close()

    return {"message": "💰 Sale recorded successfully"}


@app.route('/reports/daily', methods=['GET'])
def daily_report():
    """Return total quantity and sales grouped by product for today"""
    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({"error": "Database connection failed"}), 500

        cursor = connection.cursor(dictionary=True)
        
        # Get today's date
        today = datetime.now().strftime('%Y-%m-%d')
        
        query = """
            SELECT 
                product_id,
                product_name,
                SUM(quantity) as total_quantity_sold,
                SUM(total) as total_sales_amount,
                COUNT(*) as number_of_sales
            FROM sales
            WHERE DATE(sold_at) = %s
            GROUP BY product_id, product_name
            ORDER BY total_sales_amount DESC
        """
        
        cursor.execute(query, (today,))
        report_data = cursor.fetchall()

        # Convert Decimal to float for JSON serialization
        for item in report_data:
            if 'total_quantity_sold' in item and item['total_quantity_sold'] is not None:
                item['total_quantity_sold'] = int(item['total_quantity_sold'])
            if 'total_sales_amount' in item and item['total_sales_amount'] is not None:
                item['total_sales_amount'] = float(item['total_sales_amount'])
            if 'number_of_sales' in item:
                item['number_of_sales'] = int(item['number_of_sales'])

        # Calculate overall totals
        total_sales = sum(item['total_sales_amount'] for item in report_data)
        total_quantity = sum(item['total_quantity_sold'] for item in report_data)

        return jsonify({
            "date": today,
            "products": report_data,
            "summary": {
                "total_sales_amount": float(total_sales),
                "total_quantity_sold": int(total_quantity),
                "products_count": len(report_data)
            }
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        close_db_connection(connection, cursor)


@app.route('/mpesa/prompt', methods=['POST'])
def mpesa_prompt():
    """Simulate M-Pesa STK push (mock response)"""
    try:
        data = request.get_json()
        
        customer_phone = data.get('customer_phone', '')
        amount = data.get('amount', 0)
        product_id = data.get('product_id')

        # Validate input
        if not customer_phone or not amount:
            return jsonify({"error": "customer_phone and amount are required"}), 400

        # Simulate M-Pesa response
        mock_response = {
            "ResponseCode": "0",
            "ResponseDescription": "Success. Request accepted for processing",
            "MerchantRequestID": f"MILKA{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "CheckoutRequestID": f"ws_CO_{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "CustomerMessage": f"Confirm payment of KES {amount} to Milka Shop Juja. Enter your M-Pesa PIN to complete the transaction."
        }

        # Optional: Store payment request in database
        connection = None
        cursor = None
        try:
            connection = get_db_connection()
            if connection:
                cursor = connection.cursor()
                cursor.execute("""
                    INSERT INTO payments (customer_phone, amount, product_id, note, status, requested_by, requested_at)
                    VALUES (%s, %s, %s, %s, %s, %s, NOW())
                """, (
                    customer_phone,
                    amount,
                    product_id,
                    f"M-Pesa STK Push initiated",
                    "pending",
                    data.get('requested_by', 'system')
                ))
                connection.commit()
        except Exception as e:
            # Log error but don't fail the request
            print(f"Error saving payment record: {e}")
        finally:
            close_db_connection(connection, cursor)

        return jsonify(mock_response), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)


"""
Database configuration for Milka Shop POS system
Connects to MySQL database on PythonAnywhere
"""

import mysql.connector


def get_db_connection():
    return mysql.connector.connect(
        host="peter2valid.mysql.pythonanywhere-services.com",
        user="peter2valid",
        password="pizii540...",
        database="peter2valid$milka_shop"
    )


def get_connection():
    """Alias for get_db_connection() for convenience"""
    return get_db_connection()


def close_db_connection(connection, cursor):
    if cursor:
        cursor.close()
    if connection:
        connection.close()


#!/bin/bash

# Prestige Strategies - Database Setup Script
# This script sets up MySQL/MariaDB database for local development

echo "=== Prestige Strategies Database Setup ==="
echo ""

# Check if MySQL/MariaDB is running
if ! command -v mysql &>/dev/null; then
	echo "ERROR: MySQL/MariaDB client not found!"
	echo ""
	echo "Please install MariaDB:"
	echo "  sudo pacman -S mariadb"
	echo ""
	echo "Then initialize and start it:"
	echo "  sudo mariadb-install-db --user=mysql --basedir=/usr --datadir=/var/lib/mysql"
	echo "  sudo systemctl start mariadb"
	echo "  sudo mysql_secure_installation"
	exit 1
fi

# Import the schema
echo "Importing database schema..."
mysql -u root -p <database/schema.sql

if [ $? -eq 0 ]; then
	echo ""
	echo "✓ Database setup complete!"
	echo ""
	echo "You can now log in at: http://localhost:5173/admin/login"
	echo "Email: trononly1@gmail.com"
	echo "Password: Tront@lkno1"
else
	echo ""
	echo "✗ Failed to import schema. Please check your MySQL credentials."
	exit 1
fi

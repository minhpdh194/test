#!/bin/bash
# Khởi động cron
service cron start
# Khởi động Laravel
php artisan serve --host=0.0.0.0 --port=8000

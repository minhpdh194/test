# Sử dụng PHP 8.1 với Apache làm hình ảnh cơ sở
FROM php:8.2-apache

# Cài đặt các extension PHP cần thiết cho Laravel và các công cụ hỗ trợ
RUN apt-get update && apt-get install -y \
    git \
    zip \
    unzip \
    libzip-dev \
    curl \
    gnupg \
    cron \
    openssl \
    && docker-php-ext-install pdo pdo_mysql zip

# Cài đặt Node.js và npm
# RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - \
#     && apt-get install -y nodejs
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - \
    && apt-get install -y nodejs


# Cài đặt Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Đặt thư mục làm việc
WORKDIR /var/www/html

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Cài đặt các phụ thuộc thông qua Composer
RUN composer install --no-interaction --optimize-autoloader

# Tạo các thư mục 'storage', 'bootstrap/cache', và 'public/build' nếu chưa tồn tại
RUN mkdir -p /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/public/build

# Thiết lập quyền cho các thư mục cần thiết
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/public/build

# Cài đặt các phụ thuộc frontend qua npm
RUN npm install

# Build các tài nguyên frontend bằng Vite
RUN npm run build

# RUN php artisan migrate --force
# RUN php artisan db:seed --class=DatabaseSeeder --force
RUN echo "*/2 * * * * /usr/local/bin/php /var/www/html/artisan app:integration >> /var/log/cron.log 2>&1" >> /etc/cron.d/laravel-cron \
    && echo "*/4 * * * * /usr/local/bin/php /var/www/html/artisan app:pnl-computation >> /var/log/cron.log 2>&1" >> /etc/cron.d/laravel-cron \
    && echo "*/4 * * * * /usr/local/bin/php /var/www/html/artisan app:ranking-computation >> /var/log/cron.log 2>&1" >> /etc/cron.d/laravel-cron \
    && echo "0 0 * * * sleep 30 && /usr/local/bin/php /var/www/html/artisan app:clear-daily-tasks >> /var/log/cron.log 2>&1" >> /etc/cron.d/laravel-cron \
    && chmod 0644 /etc/cron.d/laravel-cron \
    && crontab /etc/cron.d/laravel-cron


COPY start.sh /start.sh
RUN chmod +x /start.sh





# Expose cổng 8000 cho Laravel
EXPOSE 8000
# Khởi động ứng dụng Laravel
CMD ["/start.sh"]

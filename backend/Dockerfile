FROM php:8.2-fpm

# نصب پکیج‌ها
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpng-dev libonig-dev libxml2-dev zip unzip git curl \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd \
    && rm -rf /var/lib/apt/lists/*

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# کپی entrypoint
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

WORKDIR /var/www
COPY . .

# نصب وابستگی‌ها
RUN composer install --optimize-autoloader --no-dev --no-interaction

# دسترسی‌ها
RUN chown -R www-data:www-data /var/www \
    && chmod -R 755 /var/www/storage \
    && chmod -R 755 /var/www/bootstrap/cache

EXPOSE 9000

ENTRYPOINT ["docker-entrypoint.sh"]
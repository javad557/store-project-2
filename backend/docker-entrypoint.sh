#!/bin/bash
set -e

echo "Waiting for MySQL to be ready..."
until php artisan tinker --execute="echo DB::connection()->getPdo();" >/dev/null 2>&1; do
  sleep 1
done

echo "Running Laravel setup..."
php artisan key:generate --force
php artisan migrate --force
php artisan config:cache
php artisan storage:link || true

echo "Starting PHP-FPM..."
exec php-fpm
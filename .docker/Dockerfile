FROM php:8.4-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    nodejs \
    curl \
    zip \
    unzip \
    libzip-dev \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libmcrypt-dev \
    libxslt-dev \
    libssl-dev \
    zlib1g-dev \
    libcurl4-openssl-dev \
    libedit-dev \
    libsqlite3-dev \
    && docker-php-ext-install pdo_mysql mbstring zip exif pcntl bcmath

# Install xdebug
RUN pecl install xdebug && docker-php-ext-enable xdebug

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Permissions fix for Laravel
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

EXPOSE 9000

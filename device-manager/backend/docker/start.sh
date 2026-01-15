#!/bin/bash

# Iniciar PHP-FPM em background
php-fpm -D

# Aguardar o banco de dados estar pronto
echo "Aguardando MySQL..."
until php artisan migrate:status &> /dev/null
do
  echo "MySQL não está pronto - aguardando..."
  sleep 2
done

echo "MySQL está pronto!"

# Executar migrations
php artisan migrate --force

# Executar seeders (opcional - descomente se quiser)
# php artisan db:seed --force

# Gerar chave da aplicação se não existir
php artisan key:generate --force

# Limpar e cachear configurações
php artisan config:cache
php artisan route:cache

# Iniciar Nginx em foreground
nginx -g "daemon off;"

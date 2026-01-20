# Device Manager 📱

Sistema completo de gerenciamento de dispositivos com autenticação JWT, desenvolvido com Laravel 11 (Backend) e Angular 19 (Frontend).

![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20?style=flat&logo=laravel)
![Angular](https://img.shields.io/badge/Angular-19-DD0031?style=flat&logo=angular)
![PHP](https://img.shields.io/badge/PHP-8.2-777BB4?style=flat&logo=php)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat&logo=mysql)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat&logo=typescript)

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Como Executar](#como-executar)
- [Testes](#testes)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [API Endpoints](#api-endpoints)
- [Docker (Opcional)](#docker-opcional)
- [Seeders](#seeders)
- [Troubleshooting](#troubleshooting)
- [Licença](#licença)

---

## 🎯 Sobre o Projeto

O **Device Manager** é uma aplicação full-stack para gerenciar dispositivos eletrônicos, permitindo:

- Cadastro e autenticação de usuários
- CRUD completo de dispositivos
- Filtros combinados (localização, status, data)
- Paginação de resultados
- Soft delete
- Isolamento de dados por usuário
- Interface moderna com Material Design

---

## ✨ Funcionalidades

### Autenticação
- ✅ Registro de usuários
- ✅ Login com JWT (Laravel Sanctum)
- ✅ Logout
- ✅ Proteção de rotas (Guards)

### Gerenciamento de Dispositivos
- ✅ Criar dispositivo
- ✅ Listar dispositivos (paginado)
- ✅ Visualizar detalhes
- ✅ Editar dispositivo
- ✅ Deletar dispositivo (soft delete)
- ✅ Marcar como "em uso" / "disponível"

### Filtros
- ✅ Filtrar por localização
- ✅ Filtrar por status (em uso / disponível)
- ✅ Filtrar por período de compra
- ✅ Combinar múltiplos filtros
- ✅ Persistência de filtros (localStorage)

### Extras
- ✅ Validações front-end e back-end
- ✅ Testes unitários (PHPUnit + Vitest)
- ✅ Documentação da API (Postman Collection)
- ✅ Seeders com dados de exemplo
- ✅ Responsivo (Mobile-first)

---

## 🛠 Tecnologias Utilizadas

### Backend
- **Laravel 11** - Framework PHP
- **MySQL 8.0** - Banco de dados
- **Laravel Sanctum** - Autenticação JWT
- **PHPUnit** - Testes unitários

### Frontend
- **Angular 19** - Framework TypeScript
- **Angular Material** - Componentes UI
- **RxJS** - Programação reativa
- **Vitest** - Testes unitários

### Ferramentas
- **Composer** - Gerenciador de dependências PHP
- **npm** - Gerenciador de dependências Node.js
- **Postman** - Testes de API
- **Docker** (Opcional) - Containerização

---

## 📦 Pré-requisitos

### Obrigatórios

- **PHP** >= 8.2
- **Composer** >= 2.0
- **Node.js** >= 20.0
- **npm** >= 10.0
- **MySQL** >= 8.0

### Opcionais

- **Docker Desktop** (para ambiente containerizado)
- **Postman** (para testar API)

---

## 🚀 Instalação

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/device-manager.git
cd device-manager

2. Configurar Backend (Laravel)

cd backend

# Instalar dependências
composer install

# Copiar arquivo de ambiente
copy .env.example .env

# Gerar chave da aplicação
php artisan key:generate

# Configurar banco de dados no .env
# DB_DATABASE=device_manager
# DB_USERNAME=root
# DB_PASSWORD=

# Criar banco de dados
# Execute no MySQL: CREATE DATABASE device_manager;

# Executar migrations
php artisan migrate

# (Opcional) Popular banco com dados de exemplo
php artisan db:seed

3. Configurar Frontend (Angular)

cd ../frontend

# Instalar dependências
npm install

# Configurar URL da API (se necessário)
# Edite: src/environments/environment.ts
# apiUrl: 'http://127.0.0.1:8000/api'
▶️ Como Executar
Backend (Laravel)
bash
cd backend

# Iniciar servidor de desenvolvimento
php artisan serve

# Servidor estará rodando em: http://127.0.0.1:8000
Frontend (Angular)
bash
cd frontend

# Iniciar servidor de desenvolvimento
ng serve

# Aplicação estará rodando em: http://localhost:4200
Acessar a Aplicação
Abra o navegador em: http://localhost:4200

Faça login com as credenciais dos seeders:

Email: admin@example.com

Senha: senha123

🧪 Testes
Testes Backend (PHPUnit)
bash
cd backend

# Executar todos os testes
vendor/bin/phpunit

# Com saída detalhada
vendor/bin/phpunit --testdox

# Testes específicos
vendor/bin/phpunit --filter AuthControllerTest
Resultado esperado:

text
Tests: 23, Assertions: 42
✓ AuthController (10 tests)
✓ DeviceController (13 tests)
Testes Frontend (Vitest)
bash
cd frontend

# Executar testes
ng test

# Executar uma vez (sem watch)
ng test --watch=false
Resultado esperado:

text
Test Files: 3 passed (3)
Tests: 16 passed (16)
✓ AppComponent (2 tests)
✓ AuthService (8 tests)
✓ DeviceService (6 tests)
📁 Estrutura do Projeto
text
device-manager/
├── backend/                          # Laravel API
│   ├── app/
│   │   ├── Http/
│   │   │   └── Controllers/
│   │   │       ├── AuthController.php
│   │   │       └── DeviceController.php
│   │   └── Models/
│   │       ├── User.php
│   │       └── Device.php
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   │       ├── UserSeeder.php
│   │       └── DeviceSeeder.php
│   ├── routes/
│   │   └── api.php
│   ├── tests/
│   │   └── Feature/
│   │       ├── AuthControllerTest.php
│   │       └── DeviceControllerTest.php
│   ├── postman_collection.json       # Collection Postman
│   ├── API_DOCUMENTATION.md          # Documentação da API
│   └── .env.example
│
├── frontend/                         # Angular App
│   ├── src/
│   │   └── app/
│   │       ├── components/
│   │       │   ├── device-form/
│   │       │   └── navbar/
│   │       ├── pages/
│   │       │   ├── login/
│   │       │   ├── register/
│   │       │   └── device-list/
│   │       ├── services/
│   │       │   ├── auth.ts
│   │       │   └── device.ts
│   │       ├── guards/
│   │       │   └── auth-guard.ts
│   │       ├── interceptors/
│   │       │   └── auth-interceptor.ts
│   │       ├── models/
│   │       │   ├── user.model.ts
│   │       │   └── device.model.ts
│   │       └── environments/
│   │           └── environment.ts
│   └── package.json
│
├── docker-compose.yml                # Docker Compose (opcional)
└── README.md      
                   # Este arquivo
🌐 API Endpoints

Autenticação
Método	Endpoint	Descrição	Auth
POST	/api/register	Registrar usuário	❌
POST	/api/login	Login	❌
POST	/api/logout	Logout	✅
Dispositivos
Método	Endpoint	Descrição	Auth
GET	/api/devices	Listar dispositivos	✅
POST	/api/devices	Criar dispositivo	✅
GET	/api/devices/{id}	Ver detalhes	✅
PUT	/api/devices/{id}	Atualizar	✅
PATCH	/api/devices/{id}/use	Toggle status	✅
DELETE	/api/devices/{id}	Deletar	✅
📚 Documentação completa: Veja backend/API_DOCUMENTATION.md

📮 Postman Collection: Importe backend/postman_collection.json

🐳 Docker (Opcional)
Executar com Docker Compose
bash
# Build e iniciar todos os containers
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Parar containers
docker-compose down
Acessar
Frontend: http://localhost

Backend API: http://localhost:8000/api

MySQL: localhost:3306

Comandos Úteis
bash
# Ver status
docker-compose ps

# Executar migrations
docker-compose exec backend php artisan migrate

# Executar seeders
docker-compose exec backend php artisan db:seed

# Acessar bash do backend
docker-compose exec backend bash

# Limpar tudo
docker-compose down -v
🌱 Seeders
O projeto inclui seeders com dados de exemplo.

Executar Seeders
bash
cd backend

# Executar todos os seeders
php artisan db:seed

# Resetar banco e executar seeders
php artisan migrate:fresh --seed
Usuários Criados
Nome	Email	Senha
Admin User	admin@example.com	senha123
João Silva	joao@example.com	senha123
Maria Santos	maria@example.com	senha123
Dispositivos
15 dispositivos de exemplo para o usuário Admin

Variados locais, datas e status

🔧 Troubleshooting
Erro: "SQLSTATE[HY000] [1045] Access denied"
Solução: Verifique as credenciais do MySQL no .env:

text
DB_DATABASE=device_manager
DB_USERNAME=root
DB_PASSWORD=
Erro: "Cross-Origin Request Blocked"
Solução: Verifique CORS no backend (config/cors.php):

php
'allowed_origins' => ['http://localhost:4200'],
Erro: "ng: command not found"
Solução: Instale o Angular CLI globalmente:

bash
npm install -g @angular/cli
Erro: "Class 'Facade\Ignition...' not found"
Solução: Limpe o cache do Laravel:

bash
php artisan config:clear
php artisan cache:clear
composer dump-autoload
Frontend não conecta na API
Solução: Verifique a URL da API em src/environments/environment.ts:

typescript
export const environment = {
  production: false,
  apiUrl: 'http://127.0.0.1:8000/api'
};
Porta 8000 já está em uso
Solução: Use outra porta:

bash
php artisan serve --port=8001
E atualize a URL no frontend.

📊 Estatísticas do Projeto
Total de Testes: 39 (23 backend + 16 frontend)

Cobertura: AuthController, DeviceController, Services

Linhas de Código: ~3000+ (backend + frontend)

Endpoints API: 9
Componentes Angular: 5
Services: 2
Guards: 1
Interceptors: 1

📝 Funcionalidades Técnicas
Backend
✅ RESTful API
✅ JWT Authentication (Sanctum)
✅ Request Validation
✅ Eloquent ORM
✅ Query Builder
✅ Soft Deletes
✅ Migrations & Seeders
✅ API Resources
✅ CORS habilitado
✅ Rate Limiting

Frontend
✅ Standalone Components
✅ Reactive Forms
✅ HTTP Interceptors
✅ Route Guards
✅ Services com RxJS
✅ Material Design
✅ Lazy Loading
✅ TypeScript Strict Mode
✅ Environment Variables
✅ Error Handling

Gerenciamento de Dispositivos
Devices

📄 Licença
Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

Comunidade Open Source

📚 Recursos Adicionais
Documentação Laravel
Documentação Angular
Laravel Sanctum
Angular Material

Última atualização: 15 de Janeiro de 2026
<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DeviceController;
use Illuminate\Support\Facades\Route;

// Rotas públicas (não precisam de autenticação)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rotas protegidas (precisam de autenticação)
Route::middleware('auth:sanctum')->group(function () {
    // Rotas de dispositivos
    Route::get('/devices', [DeviceController::class, 'index']);
    Route::post('/devices', [DeviceController::class, 'store']);
    Route::put('/devices/{id}', [DeviceController::class, 'update']);
    Route::delete('/devices/{id}', [DeviceController::class, 'destroy']);
    Route::patch('/devices/{id}/use', [DeviceController::class, 'toggleUse']);
    
    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);
});

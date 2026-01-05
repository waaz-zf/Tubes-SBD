<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AnggotaController;

Route::post('/login', [AuthController::class, 'login']);

Route::get('/anggota', [AnggotaController::class, 'index']);       // pagination
Route::get('/anggota-all', [AnggotaController::class, 'all']);    // tanpa pagination

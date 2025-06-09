<?php

use Illuminate\Support\Facades\Route;

Route::get('/check', function () {
    return response()->json(['status' => 'Web route working']);
});

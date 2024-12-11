<?php

namespace App\Http\Controllers;

use App\Models\Levels;

class LevelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $levels = Levels::all();

        return response()->json($levels);
    }
}

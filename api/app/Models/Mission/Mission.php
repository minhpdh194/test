<?php

namespace App\Models\Mission;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mission extends Model
{
    use HasFactory;

    protected $table = "missions";

    protected $guarded  = [];
}

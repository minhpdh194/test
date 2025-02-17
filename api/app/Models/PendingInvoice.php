<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PendingInvoice extends Model
{
    use HasFactory;

    protected $guarded = [];
    protected $table = "pending_invoices";

}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CalendarClosure extends Model
{
    use HasFactory;

    protected $table = 'calendar_closures';

    protected $fillable = [
        'date',
        'reason',
        'recurrence',
    ];

    protected $casts = [
        'date' => 'date',
    ];
}



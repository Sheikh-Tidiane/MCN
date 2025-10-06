<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CalendarEvent extends Model
{
    use HasFactory;

    protected $table = 'calendar_events';

    protected $fillable = [
        'date',
        'title',
        'description',
        'capacity_multiplier',
    ];

    protected $casts = [
        'date' => 'date',
        'capacity_multiplier' => 'float',
    ];
}



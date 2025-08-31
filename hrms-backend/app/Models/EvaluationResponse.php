<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EvaluationResponse extends Model
{
    use HasFactory;

    protected $fillable = [
        'evaluation_id',
        'evaluation_question_id',
        'rating',
        'classification',
        'manager_comment',
    ];

    protected $casts = [
        'rating' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function evaluation()
    {
        return $this->belongsTo(Evaluation::class);
    }

    public function question()
    {
        return $this->belongsTo(EvaluationQuestion::class, 'evaluation_question_id');
    }

    // Scopes
    public function scopeStrengths($query)
    {
        return $query->where('classification', 'Strength');
    }

    public function scopeWeaknesses($query)
    {
        return $query->where('classification', 'Weakness');
    }

    public function scopeHighRatings($query, $threshold = 8)
    {
        return $query->where('rating', '>', $threshold);
    }

    public function scopeLowRatings($query, $threshold = 7)
    {
        return $query->where('rating', '<', $threshold);
    }

    // Mutators
    public function setRatingAttribute($value)
    {
        $this->attributes['rating'] = max(1, min(10, $value)); // Ensure rating is between 1-10
        
        // Auto-classify based on rating
        if ($value >= 8) {
            $this->attributes['classification'] = 'Strength';
        } elseif ($value <= 6) {
            $this->attributes['classification'] = 'Weakness';
        } else {
            $this->attributes['classification'] = 'Neutral';
        }
    }

    // Helper methods
    public function isStrength()
    {
        return $this->classification === 'Strength';
    }

    public function isWeakness()
    {
        return $this->classification === 'Weakness';
    }

    public function isNeutral()
    {
        return $this->classification === 'Neutral';
    }
}
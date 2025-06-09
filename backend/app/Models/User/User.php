<?php

namespace App\Models\User;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Models\Auth\Otp;
use App\Models\Auth\RecoveryCode;
use App\Models\Market\Comment;
use App\Models\Market\Rating;
use App\Models\Marketing\Copan;
use App\Models\Profile\Comparison;
use App\Models\Profile\Favorite;
use App\Models\PurchaseProcess\Cart;
use App\Models\PurchaseProcess\Order;
use App\Models\support\Ticket;
use App\Models\system\Violation;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];


      public function comparisons()
    {
        return $this->hasMany(Comparison::class);
    }

    /**
     * Get the favorites for the user.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    /**
     * Get the carts for the user.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function carts()
    {
        return $this->hasMany(Cart::class);
    }

    /**
     * Get the orders for the user.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Get the comments for the user.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    /**
     * Get the ratings for the user.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }

    /**
     * Get the violations for the user.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function violations()
    {
        return $this->hasMany(Violation::class);
    }

    /**
     * Get the copans (coupons) for the user.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function copans()
    {
        return $this->hasMany(Copan::class);
    }

    /**
     * Get the OTPs for the user.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function otps()
    {
        return $this->hasMany(Otp::class);
    }

    /**
     * Get the recovery codes for the user.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function recoveryCodes()
    {
        return $this->hasMany(RecoveryCode::class);
    }

    /**
     * Get the tickets for the user.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }

    /**
     * Get the addresses for the user.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function addresses()
    {
        return $this->hasMany(Address::class);
    }
}
<?php

namespace App\Models\User;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Models\Auth\FailedAttempt;
use App\Models\Auth\Otp;
use App\Models\Auth\RecoveryCode;
use App\Models\Auth\RecoveryOtp;
use App\Models\Market\Comment;
use App\Models\Market\Rating;
use App\Models\Marketing\Copan;
use App\Models\Profile\Address;
use App\Models\Profile\Comparison;
use App\Models\Profile\Favorite;
use App\Models\PurchaseProcess\Cart;

use App\Models\PurchaseProcess\Order;
use App\Models\support\Ticket;
use App\Models\system\Violation;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject;

/**
 * @method bool hasRole(string $role)
 * @method bool hasPermission(string $permission)
 * @method array getAllPermissions()
 */

class User extends Authenticatable implements JWTSubject
{
    use HasApiTokens, HasFactory, Notifiable,SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'mobile',
        'last_name',
        'is_admin',
        'national_code',
        'birthdate',
        'id_type',
        'mobile_veryfied_at',
        'email_veryfied_at',
        'two_factor_secret',
        'two_factor_enabled',
        'is_blocked',
        'blocked_until',
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

     /**
     * Get the identifier that will be stored in the JWT's sub claim.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey(); // معمولاً ID کاربر
    }

    /**
     * Return a key-value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [
            'is_admin' => $this->is_admin, // افزودن is_admin به توکن JWT
        ];
    }

    protected $appends = ['full_name'];

     public function getfullNameAttribute()
    {
        return $this->name . ' ' . $this->last_name;
    }

     public function permissions()
    {
        return $this->belongsToMany(Permission::class);
    }

     public function roles()
    {
        return $this->belongsToMany(Role::class);
    }

      public function failedAttempts()
    {
        return $this->hasMany(FailedAttempt::class);
    }

      public function comparisons()
    {
        return $this->hasMany(Comparison::class);
    }

    // چک کردن اینکه کاربر یه نقش خاص داره یا نه
    public function hasRole($role)
    {
        return $this->roles()->where('name', $role)->exists();
    }

    // چک کردن اینکه کاربر یه دسترسی خاص داره یا نه
     public function hasPermission($permission)
    {
        // چک کردن دسترسی مستقیم
        if ($this->permissions()->where('name', $permission)->exists()) {
            return true;
        }

        // چک کردن دسترسی از طریق نقش‌ها
        return $this->roles()->whereHas('permissions', function ($query) use ($permission) {
            $query->where('name', $permission);
        })->exists();
    }

     public function getAllPermissions()
    {
        // دسترسی‌های مستقیم
        $directPermissions = $this->permissions()->pluck('name')->toArray();

        // دسترسی‌های از طریق نقش‌ها
        $rolePermissions = $this->roles()
            ->with('permissions')
            ->get()
            ->pluck('permissions')
            ->flatten()
            ->pluck('name')
            ->toArray();

        // ادغام و حذف تکراری‌ها
        return array_unique(array_merge($directPermissions, $rolePermissions));
    }


    /**
     * Get the favorites for the user.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function favorites()
    {
        return $this->hasMany(Favorite::class,'user_id');
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
    public function recoveryOtps()
    {
        return $this->hasMany(RecoveryOtp::class);
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
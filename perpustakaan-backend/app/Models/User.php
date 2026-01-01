<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    protected $table = 'users';
    protected $primaryKey = 'id_user';
    public $timestamps = false;

    protected $fillable = [
        'username',
        'password',
        'email'
    ];

    protected $hidden = ['password'];

    public function roles()
    {
        return $this->belongsToMany(
            Role::class,
            'user_role',
            'id_user',
            'id_role'
        );
    }
}

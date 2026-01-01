<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    public function handle(Request $request, Closure $next, $role)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $roles = $user->roles->pluck('nama_role')->toArray();

        if (!in_array($role, $roles)) {
            return response()->json([
                'message' => '403 Forbidden - Akses ditolak'
            ], 403);
        }

        return $next($request);
    }
}

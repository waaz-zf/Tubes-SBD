<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnggotaController extends Controller
{
    /**
     * =====================================================
     * SCENARIO 1: DENGAN PAGINATION
     * - Digunakan oleh Admin, Editor, Viewer
     * - Support search & sort
     * =====================================================
     */
    public function index(Request $request)
    {
        $perPage   = $request->get('per_page', 10);
        $search    = $request->get('search');
        $orderBy   = $request->get('orderBy', 'id_anggota');
        $direction = $request->get('direction', 'asc');

        $query = DB::table('anggota')->select(
            'id_anggota',
            'nama',
            'email',
            'alamat',
            'tanggal_daftar'
        );

        // SEARCH
        if (!empty($search)) {
            $query->where('nama', 'like', '%' . $search . '%');
        }

        // SORT (WHITELIST)
        $allowedSort = ['id_anggota', 'nama', 'tanggal_daftar'];
        if (in_array($orderBy, $allowedSort)) {
            $query->orderBy($orderBy, $direction);
        }

        return response()->json(
            $query->paginate($perPage)
        );
    }

    /**
     * =====================================================
     * SCENARIO 2: TANPA PAGINATION (STRESS TEST)
     * - Endpoint BERAT
     * - Akses dikontrol di FRONTEND (RBAC UI)
     =====================================================
     */
    public function all()
    {
        /**
         * ⚠️ TANPA PAGINATION
         * Dibatasi untuk mencegah crash browser
         */
        $anggota = DB::table('anggota')
            ->select(
                'id_anggota',
                'nama',
                'email',
                'alamat',
                'tanggal_daftar'
            )
            ->limit(5000) // AMAN
            ->get();

        return response()->json($anggota);
    }
}

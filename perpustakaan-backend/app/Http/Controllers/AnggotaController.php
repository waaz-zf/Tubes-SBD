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

        // SORT (AMAN)
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
     * - Digunakan untuk simulasi beban tinggi
     * =====================================================
     */
    public function all()
    {
        return response()->json(
            DB::table('anggota')->select(
                'id_anggota',
                'nama',
                'email',
                'alamat',
                'tanggal_'
            )->get()
        );
    }
}

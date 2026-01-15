<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class DeviceController extends Controller
{
    /**
     * Listar todos os dispositivos do usuário autenticado
     * GET /api/devices?page=1
     */
    public function index(Request $request)
    {
        // Pega o ID do usuário logado
        $userId = $request->user()->id;
        
        // Inicia a consulta no banco (sem usar Eloquent)
        $query = DB::table('devices')
            ->where('user_id', $userId)
            ->whereNull('deleted_at');  // Não pega os deletados (soft delete)

        // FILTRO: localização
        if ($request->has('location') && $request->location != '') {
            $query->where('location', 'like', '%' . $request->location . '%');
        }

        // FILTRO: em uso (true/false)
        if ($request->has('in_use') && $request->in_use !== '') {
            $query->where('in_use', $request->in_use);
        }

        // FILTRO: data de compra (de)
        if ($request->has('purchase_date_from') && $request->purchase_date_from != '') {
            $query->where('purchase_date', '>=', $request->purchase_date_from);
        }

        // FILTRO: data de compra (até)
        if ($request->has('purchase_date_to') && $request->purchase_date_to != '') {
            $query->where('purchase_date', '<=', $request->purchase_date_to);
        }

        // ORDENAÇÃO
        $sortBy = $request->get('sort_by', 'created_at');  // Padrão: ordenar por data de criação
        $sortOrder = $request->get('sort_order', 'desc');  // Padrão: mais recente primeiro
        $query->orderBy($sortBy, $sortOrder);

        // PAGINAÇÃO: 15 itens por página (ou o valor enviado)
        $perPage = $request->get('per_page', 15);
        $devices = $query->paginate($perPage);

        return response()->json($devices);
    }

    /**
     * Criar um novo dispositivo
     * POST /api/devices
     */
    public function store(Request $request)
    {
        // VALIDAÇÃO dos dados recebidos
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'purchase_date' => 'required|date|before_or_equal:today',
            'in_use' => 'boolean'
        ], [
            // Mensagens customizadas
            'name.required' => 'O nome do dispositivo é obrigatório',
            'location.required' => 'A localização é obrigatória',
            'purchase_date.required' => 'A data de compra é obrigatória',
            'purchase_date.before_or_equal' => 'A data de compra não pode ser futura'
        ]);

        // Se a validação falhar, retorna erro 422
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Insere no banco e pega o ID gerado
        $deviceId = DB::table('devices')->insertGetId([
            'name' => $request->name,
            'location' => $request->location,
            'purchase_date' => $request->purchase_date,
            'in_use' => $request->in_use ?? false,  // Se não enviar, usa false
            'user_id' => $request->user()->id,  // Pega o ID do usuário logado
            'created_at' => now(),
            'updated_at' => now()
        ]);

        // Busca o dispositivo criado para retornar
        $device = DB::table('devices')->find($deviceId);

        return response()->json($device, 201);  // 201 = Created
    }

    /**
     * Atualizar um dispositivo
     * PUT /api/devices/{id}
     */
    public function update(Request $request, $id)
    {
        // VALIDAÇÃO
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'purchase_date' => 'required|date|before_or_equal:today',
            'in_use' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Verifica se o dispositivo existe E pertence ao usuário logado
        $device = DB::table('devices')
            ->where('id', $id)
            ->where('user_id', $request->user()->id)
            ->whereNull('deleted_at')
            ->first();

        if (!$device) {
            return response()->json(['message' => 'Dispositivo não encontrado'], 404);
        }

        // Atualiza no banco
        DB::table('devices')->where('id', $id)->update([
            'name' => $request->name,
            'location' => $request->location,
            'purchase_date' => $request->purchase_date,
            'in_use' => $request->in_use ?? false,
            'updated_at' => now()
        ]);

        // Busca o dispositivo atualizado
        $updatedDevice = DB::table('devices')->find($id);

        return response()->json($updatedDevice);
    }

    /**
     * Deletar um dispositivo (Soft Delete)
     * DELETE /api/devices/{id}
     */
    public function destroy(Request $request, $id)
    {
        // Verifica se o dispositivo existe E pertence ao usuário
        $device = DB::table('devices')
            ->where('id', $id)
            ->where('user_id', $request->user()->id)
            ->whereNull('deleted_at')
            ->first();

        if (!$device) {
            return response()->json(['message' => 'Dispositivo não encontrado'], 404);
        }

        // Soft Delete: apenas marca como deletado, não remove do banco
        DB::table('devices')->where('id', $id)->update([
            'deleted_at' => now()
        ]);

        return response()->json(['message' => 'Dispositivo deletado com sucesso']);
    }

    /**
     * Marcar/desmarcar dispositivo como "em uso"
     * PATCH /api/devices/{id}/use
     */
    public function toggleUse(Request $request, $id)
    {
        // Verifica se o dispositivo existe E pertence ao usuário
        $device = DB::table('devices')
            ->where('id', $id)
            ->where('user_id', $request->user()->id)
            ->whereNull('deleted_at')
            ->first();

        if (!$device) {
            return response()->json(['message' => 'Dispositivo não encontrado'], 404);
        }

        // Inverte o valor de in_use (true vira false, false vira true)
        DB::table('devices')->where('id', $id)->update([
            'in_use' => !$device->in_use,
            'updated_at' => now()
        ]);

        // Busca o dispositivo atualizado
        $updatedDevice = DB::table('devices')->find($id);

        return response()->json($updatedDevice);
    }
}

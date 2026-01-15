<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DeviceControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $token;

    /**
     * Setup que roda antes de cada teste
     */
    protected function setUp(): void
    {
        parent::setUp();

        // Criar usuário de teste
        $this->user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password123')
        ]);

        // Criar token para autenticação
        $this->token = $this->user->createToken('test-token')->plainTextToken;
    }

    /**
     * Teste: Listar dispositivos sem autenticação deve retornar 401
     */
    public function test_list_devices_without_auth_returns_unauthorized(): void
    {
        $response = $this->getJson('/api/devices');
        $response->assertStatus(401);
    }

    /**
     * Teste: Criar dispositivo com sucesso
     */
    public function test_create_device_successfully(): void
    {
        $deviceData = [
            'name' => 'iPhone 15 Pro',
            'location' => 'Escritório',
            'purchase_date' => '2024-01-15',
            'in_use' => true
        ];

        $response = $this->withHeader('Authorization', 'Bearer ' . $this->token)
                         ->postJson('/api/devices', $deviceData);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'id',
                     'name',
                     'location',
                     'purchase_date',
                     'in_use',
                     'user_id'
                 ])
                 ->assertJson([
                     'name' => 'iPhone 15 Pro',
                     'location' => 'Escritório'
                 ]);

        // Verificar se foi salvo no banco
        $this->assertDatabaseHas('devices', [
            'name' => 'iPhone 15 Pro',
            'location' => 'Escritório',
            'user_id' => $this->user->id
        ]);
    }

    /**
     * Teste: Validação - nome obrigatório
     */
    public function test_create_device_without_name_fails(): void
    {
        $deviceData = [
            'location' => 'Escritório',
            'purchase_date' => '2024-01-15',
            'in_use' => false
        ];

        $response = $this->withHeader('Authorization', 'Bearer ' . $this->token)
                         ->postJson('/api/devices', $deviceData);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['name']);
    }

    /**
     * Teste: Validação - localização obrigatória
     */
    public function test_create_device_without_location_fails(): void
    {
        $deviceData = [
            'name' => 'iPhone 15',
            'purchase_date' => '2024-01-15',
            'in_use' => false
        ];

        $response = $this->withHeader('Authorization', 'Bearer ' . $this->token)
                         ->postJson('/api/devices', $deviceData);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['location']);
    }

    /**
     * Teste: Validação - data de compra não pode ser futura
     */
    public function test_create_device_with_future_date_fails(): void
    {
        $deviceData = [
            'name' => 'iPhone 15',
            'location' => 'Escritório',
            'purchase_date' => '2030-01-15',  // Data futura
            'in_use' => false
        ];

        $response = $this->withHeader('Authorization', 'Bearer ' . $this->token)
                         ->postJson('/api/devices', $deviceData);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['purchase_date']);
    }

    /**
     * Teste: Listar dispositivos com paginação
     */
    public function test_list_devices_with_pagination(): void
    {
        // Criar 20 dispositivos
        for ($i = 1; $i <= 20; $i++) {
            DB::table('devices')->insert([
                'name' => "Device $i",
                'location' => "Location $i",
                'purchase_date' => '2024-01-15',
                'in_use' => $i % 2 === 0,
                'user_id' => $this->user->id,
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }

        $response = $this->withHeader('Authorization', 'Bearer ' . $this->token)
                         ->getJson('/api/devices?per_page=10');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'current_page',
                     'data',
                     'total',
                     'per_page'
                 ])
                 ->assertJson([
                     'total' => 20,
                     'per_page' => 10
                 ]);

        $this->assertCount(10, $response->json('data'));
    }

    /**
     * Teste: Filtrar dispositivos por localização
     */
    public function test_filter_devices_by_location(): void
    {
        // Criar dispositivos com localizações diferentes
        DB::table('devices')->insert([
            [
                'name' => 'Device 1',
                'location' => 'Escritório',
                'purchase_date' => '2024-01-15',
                'in_use' => true,
                'user_id' => $this->user->id,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Device 2',
                'location' => 'Home Office',
                'purchase_date' => '2024-01-15',
                'in_use' => false,
                'user_id' => $this->user->id,
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $this->token)
                         ->getJson('/api/devices?location=Escritório');

        $response->assertStatus(200);
        
        $devices = $response->json('data');
        $this->assertCount(1, $devices);
        $this->assertEquals('Escritório', $devices[0]['location']);
    }

    /**
     * Teste: Atualizar dispositivo
     */
    public function test_update_device_successfully(): void
    {
        // Criar dispositivo
        $deviceId = DB::table('devices')->insertGetId([
            'name' => 'iPhone 14',
            'location' => 'Escritório',
            'purchase_date' => '2024-01-15',
            'in_use' => false,
            'user_id' => $this->user->id,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        $updateData = [
            'name' => 'iPhone 15 Pro Max',
            'location' => 'Home Office',
            'purchase_date' => '2024-02-20',
            'in_use' => true
        ];

        $response = $this->withHeader('Authorization', 'Bearer ' . $this->token)
                         ->putJson("/api/devices/$deviceId", $updateData);

        $response->assertStatus(200)
                 ->assertJson([
                     'name' => 'iPhone 15 Pro Max',
                     'location' => 'Home Office',
                     'in_use' => 1
                 ]);

        $this->assertDatabaseHas('devices', [
            'id' => $deviceId,
            'name' => 'iPhone 15 Pro Max'
        ]);
    }

    /**
     * Teste: Deletar dispositivo (Soft Delete)
     */
    public function test_delete_device_soft_delete(): void
    {
        $deviceId = DB::table('devices')->insertGetId([
            'name' => 'iPhone 14',
            'location' => 'Escritório',
            'purchase_date' => '2024-01-15',
            'in_use' => false,
            'user_id' => $this->user->id,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $this->token)
                         ->deleteJson("/api/devices/$deviceId");

        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'Dispositivo deletado com sucesso'
                 ]);

        // Verificar soft delete
        $device = DB::table('devices')->where('id', $deviceId)->first();
        $this->assertNotNull($device->deleted_at);
    }

    /**
     * Teste: Marcar/desmarcar dispositivo como em uso
     */
    public function test_toggle_device_use(): void
    {
        $deviceId = DB::table('devices')->insertGetId([
            'name' => 'iPhone 14',
            'location' => 'Escritório',
            'purchase_date' => '2024-01-15',
            'in_use' => false,
            'user_id' => $this->user->id,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        // Marcar como em uso
        $response = $this->withHeader('Authorization', 'Bearer ' . $this->token)
                         ->patchJson("/api/devices/$deviceId/use");

        $response->assertStatus(200)
                 ->assertJson(['in_use' => 1]);

        // Desmarcar
        $response = $this->withHeader('Authorization', 'Bearer ' . $this->token)
                         ->patchJson("/api/devices/$deviceId/use");

        $response->assertStatus(200)
                 ->assertJson(['in_use' => 0]);
    }

    /**
     * Teste: Usuário não pode acessar dispositivos de outro usuário
     */
    public function test_user_cannot_access_other_user_devices(): void
    {
        // Criar outro usuário
        $otherUser = User::create([
            'name' => 'Other User',
            'email' => 'other@example.com',
            'password' => Hash::make('password123')
        ]);

        // Criar dispositivo para o outro usuário
        $deviceId = DB::table('devices')->insertGetId([
            'name' => 'Device of Other User',
            'location' => 'Other Location',
            'purchase_date' => '2024-01-15',
            'in_use' => false,
            'user_id' => $otherUser->id,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        // Tentar acessar com o usuário atual
        $response = $this->withHeader('Authorization', 'Bearer ' . $this->token)
                         ->getJson('/api/devices');

        $response->assertStatus(200);
        
        $devices = $response->json('data');
        
        // Verificar que não retorna dispositivos do outro usuário
        foreach ($devices as $device) {
            $this->assertEquals($this->user->id, $device['user_id']);
        }
    }
}

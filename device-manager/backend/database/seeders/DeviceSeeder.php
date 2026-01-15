<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DeviceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Desabilitar verificação de chaves estrangeiras
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        
        // Limpar tabela de dispositivos
        DB::table('devices')->truncate();
        
        // Reabilitar verificação de chaves estrangeiras
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Pegar o primeiro usuário (admin)
        $user = DB::table('users')->where('email', 'admin@example.com')->first();
        
        if (!$user) {
            $this->command->error('Usuário admin não encontrado! Execute o UserSeeder primeiro.');
            return;
        }
        
        $userId = $user->id;

        $devices = [
            [
                'name' => 'iPhone 15 Pro Max',
                'location' => 'Escritório - Sala 301',
                'purchase_date' => '2024-01-15',
                'in_use' => true,
                'user_id' => $userId,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Samsung Galaxy S24',
                'location' => 'Almoxarifado - Prateleira A3',
                'purchase_date' => '2024-02-20',
                'in_use' => false,
                'user_id' => $userId,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'iPad Pro 12.9"',
                'location' => 'Sala de Reuniões - 2º Andar',
                'purchase_date' => '2024-03-10',
                'in_use' => true,
                'user_id' => $userId,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'MacBook Pro M3',
                'location' => 'TI - Mesa 5',
                'purchase_date' => '2023-11-25',
                'in_use' => true,
                'user_id' => $userId,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Dell XPS 15',
                'location' => 'Design - Estação 2',
                'purchase_date' => '2023-09-15',
                'in_use' => false,
                'user_id' => $userId,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Apple Watch Series 9',
                'location' => 'RH - Gaveta Central',
                'purchase_date' => '2024-01-05',
                'in_use' => false,
                'user_id' => $userId,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'AirPods Pro 2',
                'location' => 'Marketing - Mesa 8',
                'purchase_date' => '2023-12-20',
                'in_use' => true,
                'user_id' => $userId,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Surface Pro 9',
                'location' => 'Vendas - Armário 12',
                'purchase_date' => '2024-04-01',
                'in_use' => false,
                'user_id' => $userId,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Google Pixel 8 Pro',
                'location' => 'Desenvolvimento - Bancada 1',
                'purchase_date' => '2023-10-18',
                'in_use' => true,
                'user_id' => $userId,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Lenovo ThinkPad X1',
                'location' => 'Financeiro - Sala 205',
                'purchase_date' => '2023-08-30',
                'in_use' => false,
                'user_id' => $userId,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Xiaomi 13 Pro',
                'location' => 'Recepção',
                'purchase_date' => '2024-05-12',
                'in_use' => true,
                'user_id' => $userId,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'OnePlus 11',
                'location' => 'Home Office - João',
                'purchase_date' => '2023-07-22',
                'in_use' => false,
                'user_id' => $userId,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'HP Elitebook 840',
                'location' => 'Suporte - Bancada 3',
                'purchase_date' => '2024-06-15',
                'in_use' => true,
                'user_id' => $userId,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Microsoft Surface Laptop 5',
                'location' => 'Administrativo - Sala 101',
                'purchase_date' => '2023-12-05',
                'in_use' => false,
                'user_id' => $userId,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Samsung Galaxy Tab S9',
                'location' => 'Gerência - Escritório Principal',
                'purchase_date' => '2024-02-28',
                'in_use' => true,
                'user_id' => $userId,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($devices as $device) {
            DB::table('devices')->insert($device);
        }

        $this->command->info('15 dispositivos criados com sucesso!');
    }
}

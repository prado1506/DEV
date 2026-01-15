<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Desabilitar verificação de chaves estrangeiras
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        
        // Limpar tabela de usuários
        DB::table('users')->truncate();
        
        // Reabilitar verificação de chaves estrangeiras
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Criar usuários de exemplo
        $users = [
            [
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'password' => Hash::make('senha123'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'João Silva',
                'email' => 'joao@example.com',
                'password' => Hash::make('senha123'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Maria Santos',
                'email' => 'maria@example.com',
                'password' => Hash::make('senha123'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($users as $user) {
            DB::table('users')->insert($user);
        }

        $this->command->info('Usuários criados com sucesso!');
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Este método cria a tabela no banco de dados
     */
    public function up(): void
    {
        Schema::create('devices', function (Blueprint $table) {
            // Cria o campo 'id' (chave primária, auto incremento)
            $table->id();
            
            // Cria o campo 'name' (texto, obrigatório)
            $table->string('name');
            
            // Cria o campo 'location' (texto, obrigatório)
            $table->string('location');
            
            // Cria o campo 'purchase_date' (data)
            $table->date('purchase_date');
            
            // Cria o campo 'in_use' (verdadeiro/falso, padrão: falso)
            $table->boolean('in_use')->default(false);
            
            // Cria o campo 'user_id' (relacionamento com tabela users)
            $table->foreignId('user_id')
                  ->constrained()  // Cria a chave estrangeira
                  ->onDelete('cascade');  // Se deletar o usuário, deleta os devices
            
            // Cria os campos 'created_at' e 'updated_at' automaticamente
            $table->timestamps();
            
            // Cria o campo 'deleted_at' para soft delete
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     * Este método desfaz a criação da tabela (usado para rollback)
     */
    public function down(): void
    {
        Schema::dropIfExists('devices');
    }
};

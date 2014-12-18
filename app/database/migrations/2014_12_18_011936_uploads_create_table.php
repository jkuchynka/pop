<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UploadsCreateTable extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('uploads', function ($table) {
            $table->increments('id');
            $table->integer('user_id')->references('id')->on('users')->onDelete(null);
            $table->string('path');
            $table->string('filename');
            $table->timestamps();

            $table->unique(['path', 'filename']);
        });

        Schema::table('users', function ($table) {
            $table->integer('image')->references('id')->on('users')->onDelete(null);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('uploads');
        Schema::table('users', function ($table) {
            $table->dropColumn('image');
        });
    }

}

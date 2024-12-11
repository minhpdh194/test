<?php

namespace Database\Seeders;

use App\Models\Popup;
use Illuminate\Database\Seeder;

class PopupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Popup::updateOrCreate(
            ['id' => 1],
            [
                'title' => "Follow us on X",
                "text" => "Follow us on X and get 10,000 coins. It takes seconds.",
                "image" => "images/missions/1.png",
                "button_text" => "Follow",
                "button_link" => "https://x.com"
            ]
        );
    }
}

<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class TranslateService
{
    public static function translateText($text, $targetLanguage) {
        $apiKey = env('OPENAI_API_KEY');

        $response = Http::withHeaders([
            'Authorization' => "Bearer $apiKey",
            'Content-Type' => 'application/json',
        ])->post('https://api.openai.com/v1/chat/completions', [
            'model' => 'gpt-4o',
            'messages' => [
                ['role' => 'system', 'content' => "Translate the following text to $targetLanguage. If the text is gibberish or meaningless, respond exactly received text"],
                ['role' => 'user', 'content' => $text],
            ],
        ]);

        $result = $response->json();
        $translation = $result['choices'][0]['message']['content'] ?? '';

        return $translation;
    }
}

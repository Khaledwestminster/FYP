from google.cloud import texttospeech
import os
from django.conf import settings

def generate_speech(text, language_code):
    """
    Generate speech from text using Google Cloud Text-to-Speech API
    Returns the audio content as base64 encoded string
    """
    # Initialize the client
    client = texttospeech.TextToSpeechClient()

    # Set the text input to be synthesized
    synthesis_input = texttospeech.SynthesisInput(text=text)

    # Build the voice request
    voice = texttospeech.VoiceSelectionParams(
        language_code=language_code,
        ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL
    )

    # Select the type of audio file you want returned
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3
    )

    # Perform the text-to-speech request
    response = client.synthesize_speech(
        input=synthesis_input,
        voice=voice,
        audio_config=audio_config
    )

    # Return the audio content
    return response.audio_content

def get_language_code(language):
    """
    Convert language name to language code for TTS
    """
    language_codes = {
        'spanish': 'es-ES',
        'french': 'fr-FR',
        'german': 'de-DE',
        'italian': 'it-IT'
    }
    return language_codes.get(language.lower(), 'en-US') 
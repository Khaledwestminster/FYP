import os
import uuid
from django.conf import settings
from gtts import gTTS
import logging

logger = logging.getLogger(__name__)

class TTSService:
    @staticmethod
    def generate_audio(text: str, language_code: str) -> str:
        """
        Generate audio file using gTTS and store it
        Returns the URL path to the audio file
        """
        try:
            # Create audio directory if it doesn't exist
            os.makedirs(settings.AUDIO_FILES_DIR, exist_ok=True)
            
            # Generate unique filename
            filename = f"{uuid.uuid4()}.mp3"
            filepath = os.path.join(settings.AUDIO_FILES_DIR, filename)
            
            # Generate audio file
            tts = gTTS(text=text, lang=language_code)
            tts.save(filepath)
            
            # Return the URL path
            return f"{settings.AUDIO_FILES_URL}{filename}"
            
        except Exception as e:
            logger.error(f"Error generating audio for text '{text}': {str(e)}")
            return None

    @staticmethod
    def delete_audio(url: str) -> bool:
        """
        Delete an audio file given its URL
        Returns True if successful, False otherwise
        """
        try:
            if not url:
                return True
                
            # Extract filename from URL
            filename = url.split('/')[-1]
            filepath = os.path.join(settings.AUDIO_FILES_DIR, filename)
            
            # Delete file if it exists
            if os.path.exists(filepath):
                os.remove(filepath)
                return True
                
            return False
            
        except Exception as e:
            logger.error(f"Error deleting audio file '{url}': {str(e)}")
            return False 
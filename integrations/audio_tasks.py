from apibr.core.queue.celery_app import app
from apibr.core.ai_models.audio.chatterbox_integration import generate_speech_chatterbox, clone_voice_chatterbox

@app.task
def process_audio_generation(job_id, text, voice_id):
    # Chamar a função de geração de fala do Chatterbox AI
    result = generate_speech_chatterbox(text, voice_id)
    return result

@app.task
def process_voice_cloning(job_id, audio_file):
    # Chamar a função de clonagem de voz do Chatterbox AI
    result = clone_voice_chatterbox(audio_file)
    return result



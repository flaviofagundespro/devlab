from apibr.core.queue.celery_app import app
from apibr.core.ai_models.video.multitalk_integration import create_avatar_multitalk, animate_video_multitalk

@app.task
def process_video_avatar_creation(job_id, image_url, voice_id, script, duration):
    result = create_avatar_multitalk(image_url, voice_id, script, duration)
    return result

@app.task
def process_video_animation(job_id, video_url, animation_params):
    result = animate_video_multitalk(video_url, animation_params)
    return result



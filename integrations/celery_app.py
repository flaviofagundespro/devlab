from celery import Celery

app = Celery(
    'apibr_studio',
    broker='redis://localhost:6379/0',
    backend='redis://localhost:6379/0',
    include=[
        'apibr.workers.audio_tasks',
        'apibr.workers.image_tasks',
        'apibr.workers.video_tasks'
    ]
)

app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='America/Sao_Paulo',
    enable_utc=True,
)



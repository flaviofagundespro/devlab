from apibr.core.queue.celery_app import app
from apibr.core.ai_models.image.flux_sd_integration import generate_image_flux, generate_image_sd35, edit_image_sd35, upscale_image_sd35

@app.task
def process_image_generation_flux(job_id, prompt, model):
    result = generate_image_flux(prompt, model)
    return result

@app.task
def process_image_generation_sd35(job_id, prompt, model):
    result = generate_image_sd35(prompt, model)
    return result

@app.task
def process_image_editing_sd35(job_id, image_url, prompt):
    result = edit_image_sd35(image_url, prompt)
    return result

@app.task
def process_image_upscale_sd35(job_id, image_url):
    result = upscale_image_sd35(image_url)
    return result



from supabase import create_client, Client
import os

# Substitua com suas credenciais Supabase
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def insert_project(name, type):
    data, count = supabase.table("projects").insert({"name": name, "type": type}).execute()
    return data[1][0]

def insert_media_asset(project_id, type, url, metadata):
    data, count = supabase.table("media_assets").insert({"project_id": project_id, "type": type, "url": url, "metadata": metadata}).execute()
    return data[1][0]

def insert_generation_job(project_id, type, parameters):
    data, count = supabase.table("generation_jobs").insert({"project_id": project_id, "type": type, "parameters": parameters}).execute()
    return data[1][0]

def update_generation_job_status(job_id, status, result=None):
    update_data = {"status": status}
    if result:
        update_data["result"] = result
        update_data["completed_at"] = "now()"
    data, count = supabase.table("generation_jobs").update(update_data).eq("id", job_id).execute()
    return data[1][0]

def get_projects():
    data, count = supabase.table("projects").select("*").execute()
    return data[1]

def get_generation_job(job_id):
    data, count = supabase.table("generation_jobs").select("*").eq("id", job_id).execute()
    return data[1][0] if data[1] else None



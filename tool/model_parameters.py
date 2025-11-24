import os
from dotenv import load_dotenv

FLASH_LATEST = "gemini-2.5-flash-preview-09-2025"
PRO = "gemini-3-pro-preview"
DEFAULT_MODEL_NAME = PRO


def getAPIKey():
	load_dotenv()
	return os.environ.get("GEMINI_API_KEY")

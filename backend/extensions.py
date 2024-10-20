from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from langchain_ollama.llms import OllamaLLM

db = SQLAlchemy()
ma = Marshmallow()
cors = CORS()
cached_llm = OllamaLLM(model="llama3.2", base_url="http://ollama_server:11434")
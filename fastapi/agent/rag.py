from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.vectorstores import InMemoryVectorStore
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
import os


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
rag_path = os.path.join(BASE_DIR, "agent.txt")
loader = TextLoader(
    file_path=rag_path,
    encoding="utf-8")

docs = loader.load()
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,        # large enough to hold table logic + rules
    chunk_overlap=200,      # preserves reasoning continuity
    add_start_index=True    # helps trace hallucinations later
)

chunks = text_splitter.split_documents(docs)
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")
vector_store = InMemoryVectorStore(embeddings)
ids = vector_store.add_documents(documents=chunks)
print("data added to v-db")
retriever = vector_store.as_retriever(search_kwargs={"k": 5})
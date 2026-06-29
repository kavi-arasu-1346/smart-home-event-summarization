import faiss
import os
import logging
import mysql.connector
from config import VECTOR_DB_PATH, METADATA_PATH, EMBEDDING_MODEL_NAME

DB_NAME = "smarthome"

class VectorStore:
    def __init__(self):
        self.index = None
        self.metadata = []
        self.model = None
        self._load_resources()

    def _load_resources(self):
        """Loads FAISS index, metadata, and embedding model."""
        try:
            # Silent / Professional Initialization
            if os.path.exists(VECTOR_DB_PATH):
                self.index = faiss.read_index(VECTOR_DB_PATH)
            else:
                pass

            if os.path.exists(METADATA_PATH):
                with open(METADATA_PATH, "r") as f:
                    self.metadata = f.read().splitlines()
            else:
                pass

            # Lazy Load heavy library here to prevent Import MemoryError
            os.environ['HF_HUB_OFFLINE'] = '1'
            from sentence_transformers import SentenceTransformer
            self.model = SentenceTransformer(EMBEDDING_MODEL_NAME)
            
        except Exception as e:
            logging.error(f"Vector System Error: {e}")

    def rebuild_index(self):
        """Creates a FAISS vector DB from historical SQL data."""
        try:
            print("Creating Vector DB from historical SQL data...")
            os.environ['HF_HUB_OFFLINE'] = '1'
            from sentence_transformers import SentenceTransformer
            
            if not self.model:
                self.model = SentenceTransformer(EMBEDDING_MODEL_NAME)
                
            # fetch all historical data
            events = []
            conn = mysql.connector.connect(
                host="localhost",
                user="root",
                password="",
                database=DB_NAME
            )
            cursor = conn.cursor(dictionary=True)
            
            tables = ['tv', 'fan', 'ac', 'light', 'oven', 'washing_machine']
            for table in tables:
                try:
                    cursor.execute(f"SELECT * FROM {table}")
                    rows = cursor.fetchall()
                    for row in rows:
                        # Convert row to dict for better context
                        event_text = f"Device: {table}, Data: {row}"
                        events.append(event_text)
                except Exception as e:
                    logging.warning(f"Skipping table {table} in vector build: {e}")
            
            conn.close()
            
            if not events:
                print("No historical data found to vectorize.")
                return

            print(f"Vectorizing {len(events)} historical events...")
            embeddings = self.model.encode(events)
            
            # Create FAISS index
            dimension = embeddings.shape[1]
            self.index = faiss.IndexFlatL2(dimension)
            self.index.add(embeddings.astype('float32'))
            
            # Save Index
            faiss.write_index(self.index, VECTOR_DB_PATH)
            
            # Save Metadata
            self.metadata = events
            with open(METADATA_PATH, "w") as f:
                f.write("\n".join(events))
                
            print(f"Vector DB created successfully with {len(events)} entries.")
            return True
            
        except Exception as e:
            logging.error(f"Error creating vector DB: {e}")
            print(f"Error creating vector DB: {e}")
            return False
            


    def query(self, text, top_k=3):
        """Encodes query and searches vector DB."""
        if not self.index or not self.model:
             return []

        try:
            query_embedding = self.model.encode([text]).astype('float32')
            if isinstance(self.index, faiss.IndexFlatL2) or isinstance(self.index, faiss.Index):
                 distances, indices = self.index.search(query_embedding, top_k)
                 
                 results = []
                 for idx in indices[0]:
                     if 0 <= idx < len(self.metadata):
                         results.append(self.metadata[idx])
                 return results
            return []
        except Exception as e:
            logging.error(f"Vector Query Error: {e}")
            return []

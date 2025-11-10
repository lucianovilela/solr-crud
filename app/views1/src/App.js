import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [documents, setDocuments] = useState([]);
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const API_URL = process.env.REACT_APP_SOLR || 'http://localhost:3000/documents';

  // Função para buscar documentos
  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${API_URL}`);
      setDocuments(response.data);
    } catch (error) {
      console.error('Erro ao buscar documentos:', error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Função para criar/atualizar documento
  const saveDocument = async () => {
    try {
      if (id) {
        await axios.put(`${API_URL}/${id}`, { id, name });
        setMessage('Documento atualizado com sucesso!');
      } else {
        await axios.post(API_URL, { id: Date.now().toString(), name });
        setMessage('Documento criado com sucesso!');
      }
      fetchDocuments();
      setId('');
      setName('');
    } catch (error) {
      console.error('Erro ao salvar documento:', error);
      setMessage('Erro ao salvar documento.');
    }
  };

  // Função para deletar documento
  const deleteDocument = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setMessage('Documento deletado com sucesso!');
      fetchDocuments();
    } catch (error) {
      console.error('Erro ao deletar documento:', error);
      setMessage('Erro ao deletar documento.');
    }
  };

  return (
    <div className="App">
      <h1>Gerenciador de Documentos Solr</h1>
      <div>
        <input
          type="text"
          placeholder="Nome do Documento"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={saveDocument}>
          {id ? 'Atualizar Documento' : 'Criar Documento'}
        </button>
      </div>
      {message && <p>{message}</p>}
      <h2>Documentos</h2>
      <ul>
        {documents.map((doc) => (
          <li key={doc.id}>
            <strong>{doc.name}</strong>
            <button onClick={() => setId(doc.id) & setName(doc.name)}>
              Editar
            </button>
            <button onClick={() => deleteDocument(doc.id)}>Deletar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

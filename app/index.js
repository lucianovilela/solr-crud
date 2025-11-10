import  express from 'express';
import  bodyParser from 'body-parser';
import  axios from 'axios';

import { fileURLToPath } from 'url';
import path, { dirname} from 'path';

import cors from 'cors';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './views/build')));

// Configurações do Solr
const SOLR_URL = process.env.SOLR_URL || 'http://localhost:8983/solr/my_core'; // Substitua 'meu_core' pelo nome do seu core



app.use(cors())


// Criar um novo documento
app.post('/documents', async (req, res) => {
  try {
    const doc = req.body;
    const response = await axios.post(`${SOLR_URL}/update`, [doc], {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    await axios.get(`${SOLR_URL}/update?commit=true`);
    res.status(201).json({ success: true, response: response.data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get('/documents/', async (req, res) => {
  try {
    const response = await axios.get(`${SOLR_URL}/select`, {
      params: {
        q:'*:*',
        wt: 'json',
      },
    });
    res.status(200).json(response.data.response.docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ler um documento pelo ID
app.get('/documents/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const response = await axios.get(`${SOLR_URL}/select`, {
      params: {
        q: `id:${id}`,
        wt: 'json',
      },
    });
    res.status(200).json(response.data.response.docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar um documento existente
app.put('/documents/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedDoc = { ...req.body, id };
    const response = await axios.post(`${SOLR_URL}/update`, [updatedDoc], {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    await axios.get(`${SOLR_URL}/update?commit=true`);
    res.status(200).json({ success: true, response: response.data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Deletar um documento pelo ID
app.delete('/documents/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const response = await axios.post(`${SOLR_URL}/update?commit=true`, [{ delete: { id } }], {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    await axios.get(`${SOLR_URL}/update?commit=true`);
    res.status(200).json({ success: true, response: response.data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Iniciando o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

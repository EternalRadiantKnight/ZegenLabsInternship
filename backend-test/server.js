const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'zegen_intern_2026';
const DB_FILE = './database.json';

app.use(cors());
app.use(express.json());

const readData = () => {
    if (!fs.existsSync(DB_FILE)) {
        const initialData = [
            { id: 1, title: "Quantum Processor", price: 499, category: "Hardware" },
            { id: 2, title: "Neural Link Core", price: 85, category: "BioTech" }
        ];
        fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
        return initialData;
    }
    const data = fs.readFileSync(DB_FILE);
    return JSON.parse(data);
};

const writeData = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(403).json({ error: "Invalid Token" });
        req.user = decoded;
        next();
    });
};

app.get('/', (req, res) => {
    res.send('<h1>🚀 Zegen Backend Active</h1><p>Docs: <a href="/api-docs">/api-docs</a></p>');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if ((username === 'admin' && password === 'admin123') || (username === 'user' && password === 'user123')) {
        const role = username === 'admin' ? 'admin' : 'user';
        const token = jwt.sign({ username, role }, SECRET_KEY);
        return res.json({ token, role });
    }
    res.status(401).json({ error: "Kredensial salah" });
});

app.get('/todos', (req, res) => {
    res.json(readData());
});

app.post('/todos', authenticate, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: "Admin Only" });
    const { title, price, category } = req.body;
    
    const todos = readData();
    const newTodo = { id: Date.now(), title, price, category };
    todos.push(newTodo);
    
    writeData(todos);
    res.status(201).json(newTodo);
});

app.delete('/todos/:id', authenticate, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: "Admin Only" });
    
    let todos = readData();
    todos = todos.filter(t => t.id !== parseInt(req.params.id));
    
    writeData(todos);
    res.json({ message: "Deleted successfully" });
});

const swaggerDocument = {
    openapi: '3.0.0',
    info: { title: 'Zegen API Internship', version: '1.0.0' },
    components: {
        securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } }
    },
    paths: {
        '/login': {
            post: {
                summary: 'Login User/Admin',
                requestBody: {
                    content: { 'application/json': { schema: { 
                        type: 'object', properties: { username: { type: 'string', example: 'admin' }, password: { type: 'string', example: 'admin123' } } 
                    } } }
                },
                responses: { 200: { description: 'OK' } }
            }
        },
        '/todos': {
            get: { summary: 'Daftar Produk' },
            post: { 
                summary: 'Tambah Produk (Admin Only)',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    content: { 'application/json': { schema: { 
                        type: 'object', properties: { title: { type: 'string' }, price: { type: 'number' }, category: { type: 'string' } } 
                    } } }
                }
            }
        }
    }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.listen(PORT, () => console.log(`Server Permanent: http://localhost:${PORT}`));
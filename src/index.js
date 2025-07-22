import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Configuração CORS mais permissiva para produção
app.use(cors({
  origin: [
    'https://gov-resgate.com',
    'https://www.gov-resgate.com',
    'http://localhost:3000',
    'http://localhost:8080',
    'http://127.0.0.1:5500',
    'http://127.0.0.1:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

// Endpoint de health check
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    message: 'Backend CNH Social funcionando perfeitamente no Railway'
  });
});

// Endpoint de status geral
app.get('/status', (req, res) => {
  res.json({
    service: 'CNH Social Backend',
    version: '2.0.0',
    status: 'online',
    platform: 'Railway',
    environment: process.env.NODE_ENV || 'production',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    platform: process.platform,
    nodeVersion: process.version,
    endpoints: {
      health: '/health',
      test: '/test',
      status: '/status',
      root: '/',
      aureolink: '/aureolink/create'
    }
  });
});

// Endpoint de teste para monitor
app.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Backend CNH Social - Teste OK (Railway)',
    timestamp: new Date().toISOString(),
    data: {
      amount: 6472, // R$ 64,72 em centavos
      customer: {
        name: 'Maria Santos',
        email: 'maria.santos@email.com',
        phone: '(11) 98765-4321',
        document: '12345678901'
      },
      items: [{
        title: 'Tarifa de Processo CNH Social',
        name: 'Tarifa CNH',
        quantity: 1,
        unit_amount: 6472
      }]
    }
  });
});

// Endpoint raiz
app.get('/', (req, res) => {
  res.json({
    message: 'CNH Social Backend is running!',
    version: '2.0.0',
    status: 'operational',
    platform: 'Railway',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      status: '/status',
      test: '/test',
      aureolink: '/aureolink/create'
    }
  });
});

// Endpoint para dados do funil (simulado)
app.get('/funnel-data', (req, res) => {
  res.json({
    success: true,
    data: {
      total_orders: 1247,
      total_revenue: 80623.84, // R$ 80.623,84
      average_order: 64.72,
      today_orders: 23,
      today_revenue: 1488.56,
      conversion_rate: 3.2,
      last_transaction: {
        id: 'txn_123456789',
        amount: 6472,
        customer: 'João Silva',
        timestamp: new Date().toISOString()
      }
    }
  });
});

// Endpoint para AureoLink (simulado)
app.post('/aureolink/create', (req, res) => {
  const { amount, customer, items } = req.body;
  
  console.log('Transação recebida:', { amount, customer, items });
  
  res.json({
    success: true,
    message: 'AureoLink simulado - pagamento processado (Railway)',
    transaction_id: 'txn_' + Date.now(),
    amount: amount || 6472,
    customer: customer,
    status: 'approved',
    timestamp: new Date().toISOString()
  });
});

// Middleware de erro
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: err.message
  });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint não encontrado',
    available_endpoints: ['/', '/health', '/status', '/test', '/aureolink/create', '/funnel-data']
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 CNH Social Backend rodando na porta ${PORT} (Railway)`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📈 Status: http://localhost:${PORT}/status`);
  console.log(`🧪 Teste: http://localhost:${PORT}/test`);
});

export default app;
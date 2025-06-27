# PortfolioGuardian 客户申请表单

这是一个安全的多步骤客户入职应用程序，用于 PortfolioGuardian 投资组合管理和报告服务。

## 🚀 功能特点

- **多步骤表单流程**：6个步骤的用户友好界面
- **身份验证**：集成 Stripe Identity 进行文件验证
- **安全性**：端到端加密，银行级安全标准
- **响应式设计**：使用 Tailwind CSS 的现代 UI
- **类型安全**：完整的 TypeScript 支持
- **状态管理**：使用 Zustand 进行表单状态管理
- **GDPR 合规**：数据处理合规性功能

## 📋 表单步骤

1. **实体类型选择** - Individual, SMSF, Company, Trust
2. **实体详细信息** - 法定名称、ABN、GST 注册、地址
3. **联系信息** - 电邮、电话、首选联系方式
4. **身份验证** - Stripe Identity 文档上传和验证
5. **投资档案** - 经验水平、风险承受能力、投资目标
6. **附加信息** - 税务居住地、实益拥有权、资金来源

## 🛠 技术栈

### 前端
- **Next.js 14** - React 框架
- **Shadcn UI** - 组件库
- **Tailwind CSS** - 样式框架
- **TypeScript** - 类型安全
- **React Hook Form** - 表单管理
- **Zod** - 数据验证
- **Zustand** - 状态管理

### 后端服务
- **Supabase** - 数据库 (PostgreSQL) 和认证
- **Stripe Identity** - 身份验证 API
- **Supabase Storage** - 加密文件存储
- **Supabase Edge Functions** - 无服务器函数

## 🔧 安装和设置

### 1. 安装依赖
```bash
npm install
```

### 2. 环境变量配置
创建 `.env.local` 文件并配置以下变量：

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# 应用程序
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# 邮件
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=noreply@portfolioguardian.com

# 安全
ENCRYPTION_KEY=your_32_character_encryption_key
RATE_LIMIT_MAX=10
```

### 3. 数据库设置
运行 Supabase 迁移来创建必需的表：

```bash
# 创建申请表
CREATE TABLE applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id VARCHAR UNIQUE NOT NULL,
  entity_type VARCHAR NOT NULL,
  entity_name VARCHAR NOT NULL,
  australian_business_number VARCHAR,
  is_registered_for_gst BOOLEAN,
  holder_identification_number VARCHAR,
  registered_address TEXT NOT NULL,
  contact_email VARCHAR NOT NULL,
  contact_phone VARCHAR NOT NULL,
  preferred_contact_method VARCHAR NOT NULL,
  stripe_identity_session_id VARCHAR,
  identity_verification_status VARCHAR DEFAULT 'pending',
  investment_experience VARCHAR,
  risk_tolerance VARCHAR,
  portfolio_size VARCHAR,
  investment_objectives JSONB,
  tax_residency VARCHAR,
  beneficial_ownership TEXT,
  source_of_funds TEXT,
  privacy_policy_accepted BOOLEAN DEFAULT FALSE,
  terms_of_service_accepted BOOLEAN DEFAULT FALSE,
  data_processing_consent BOOLEAN DEFAULT FALSE,
  is_submitted BOOLEAN DEFAULT FALSE,
  submitted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

# 创建文档表
CREATE TABLE application_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES applications(id),
  document_type VARCHAR NOT NULL,
  file_path VARCHAR NOT NULL,
  file_name VARCHAR NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR,
  uploaded_at TIMESTAMP DEFAULT NOW()
);

# 启用行级安全
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_documents ENABLE ROW LEVEL SECURITY;
```

### 4. 启动开发服务器
```bash
npm run dev
```

应用程序将在 [http://localhost:3000](http://localhost:3000) 上运行。

## 🔒 安全功能

- **HTTPS Only** - 强制 HTTPS 连接
- **内容安全策略 (CSP)** - 防止 XSS 攻击
- **输入验证** - 所有用户输入的验证和清理
- **速率限制** - API 端点的速率限制
- **审计日志** - 所有操作的日志记录
- **数据加密** - 敏感数据的端到端加密
- **自动清理** - 30天自动数据清理

## 📁 项目结构

```
PG_Application_Form/
├── app/                          # Next.js App Router
│   ├── globals.css              # 全局样式
│   ├── layout.tsx               # 根布局
│   ├── page.tsx                 # 首页
│   ├── application/             # 申请表单页面
│   │   ├── step-1/page.tsx     # 实体类型选择
│   │   ├── step-2/page.tsx     # 实体详细信息
│   │   ├── step-3/page.tsx     # 联系信息
│   │   ├── step-4/page.tsx     # 身份验证
│   │   ├── step-5/page.tsx     # 投资档案
│   │   └── step-6/page.tsx     # 审核和提交
│   ├── api/                     # API 路由
│   │   ├── stripe-identity/     # Stripe Identity 集成
│   │   ├── applications/        # 申请 CRUD
│   │   └── documents/           # 文档上传
│   └── thank-you/page.tsx       # 成功页面
├── components/                   # React 组件
│   └── ui/                      # Shadcn UI 组件
│       ├── button.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── textarea.tsx
│       └── progress-indicator.tsx
├── lib/                         # 实用程序和配置
│   ├── utils.ts                 # 通用实用程序函数
│   └── store.ts                 # Zustand 状态管理
└── public/                      # 静态资源
```

## 🚦 使用流程

1. **访问首页** - 用户看到欢迎页面和安全通知
2. **开始申请** - 点击"开始申请"按钮
3. **完成各步骤** - 逐步填写6个表单页面
4. **身份验证** - 通过 Stripe Identity 上传文档
5. **审核提交** - 最终审核并提交申请
6. **确认页面** - 收到确认和后续步骤信息

## 🔧 开发

### 添加新组件
```bash
# 使用 Shadcn UI CLI 添加组件
npx shadcn-ui@latest add [component-name]
```

### 类型检查
```bash
npm run type-check
```

### 构建生产版本
```bash
npm run build
npm start
```

## 📞 支持

如需技术支持或有任何问题，请联系 PortfolioGuardian 技术团队。

---

**注意**: 这是一个安全敏感的应用程序。在生产环境中部署之前，请确保所有安全配置正确设置，并进行充分的安全测试。 
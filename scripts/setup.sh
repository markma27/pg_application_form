#!/bin/bash

echo "🚀 Setting up PortfolioGuardian Client Application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"

if ! printf '%s\n%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V -C; then
    echo "❌ Node.js version $NODE_VERSION is not supported. Please upgrade to v18 or higher."
    exit 1
fi

echo "✅ Node.js version $NODE_VERSION detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cp .env.example .env.local
    echo "⚠️  Please update .env.local with your actual environment variables"
else
    echo "✅ .env.local already exists"
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p public/uploads
mkdir -p logs

# Set up git hooks (if git is initialized)
if [ -d .git ]; then
    echo "🔧 Setting up git hooks..."
    echo "#!/bin/bash" > .git/hooks/pre-commit
    echo "npm run type-check" >> .git/hooks/pre-commit
    chmod +x .git/hooks/pre-commit
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your Supabase and Stripe credentials"
echo "2. Set up your Supabase database using the SQL in README.md"
echo "3. Run 'npm run dev' to start the development server"
echo ""
echo "📖 For more information, see README.md" 
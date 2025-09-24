# Movie Dashboard - Cloud-Based Movie Streaming Dashboard

A modern, scalable cloud-native movie streaming platform built with cutting-edge web technologies. Stream movies and TV shows seamlessly with a beautiful, responsive interface designed for optimal user experience across all devices.

## ✨ Features

- **🎬 Extensive Movie Library**: Browse through thousands of movies and TV shows with detailed information
- **🔍 Advanced Search**: Find content by title, genre, actor, director, or keywords
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **🎨 Modern UI**: Clean, intuitive interface with dark/light theme support
- **⚡ Fast Performance**: Built with Next.js 15 for optimal loading speeds
- **🌐 Cloud-Ready**: Designed for deployment on modern cloud platforms
- **🔒 Type-Safe**: Full TypeScript implementation for reliability

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- TMDb API key (get one at [The Movie Database](https://www.themoviedb.org/documentation/api))

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/AyushGamer55/my-movie-dashboard.git
   cd my-movie-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.local .env.local
   ```
   Configure the following variables:
   - `NEXT_PUBLIC_APP_URL`: Your application URL
   - `NEXT_PUBLIC_TMDB_TOKEN`: Your TMDb API key
   - `NEXT_PUBLIC_SITE_NAME`: Your site name

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Tech Stack

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[tRPC](https://trpc.io/)** - End-to-end type-safe APIs
- **[Radix UI](https://www.radix-ui.com/)** - Accessible UI components
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight state management
- **[TMDb API](https://www.themoviedb.org/)** - Movie and TV show data
- **[Vidsrc.cc](https://vidsrc.cc)** - Streaming service integration

## 📦 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run format` - Format code with Prettier
- `npm run typecheck` - Run TypeScript type checking
- `npm run prepare` - Set up Husky for git hooks

## 🌐 Cloud Deployment

This application is optimized for cloud deployment on platforms like:

- **Vercel** - Recommended for Next.js applications
- **Cloudflare Pages** - For global CDN distribution
- **AWS Amplify** - For enterprise-grade deployments
- **Netlify** - Alternative serverless platform

### Environment Variables for Production

```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_TMDB_TOKEN=your_tmdb_api_key
NEXT_PUBLIC_SITE_NAME=Your Site Name
NEXT_PUBLIC_IMAGE_DOMAIN=image.tmdb.org
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [The Movie Database (TMDb)](https://www.themoviedb.org/) for providing comprehensive movie and TV show data
- [Vidsrc.cc](https://vidsrc.cc) for streaming service integration
- [Radix UI](https://www.radix-ui.com/) for accessible component primitives
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
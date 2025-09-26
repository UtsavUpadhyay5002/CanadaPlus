# Canada+ News PWA

A TikTok-style news app built for Canadians, featuring swipeable full-screen articles with offline support and native app-like experience.

## 🚀 Features

- **TikTok-style Interface**: Full-screen, swipeable news cards with smooth scroll-snap navigation
- **Progressive Web App**: Install to home screen, offline support, native app feel  
- **Dual Architecture**: Marketing site at `/` and app experience at `/app`
- **Soft Install Gate**: Encourages installation without blocking web access
- **Firebase Backend**: Firestore for articles, Storage for images
- **Accessibility First**: WCAG AA compliance, keyboard navigation, screen reader support
- **Performance Optimized**: Lazy loading, service worker caching, image optimization

## 📱 Surfaces

### Marketing Site (`/`)
- Clean, modern landing page explaining the product
- Install prompts and iOS/Android guidance
- SEO optimized with Open Graph tags
- Redirects to `/app` if already installed

### PWA App (`/app`) 
- Full-screen article feed with vertical snapping
- Soft gate encouraging installation (non-blocking)
- Offline support with cached articles
- Native-like navigation and interactions

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **Backend**: Firebase v10 (Firestore + Storage)
- **PWA**: Custom Service Worker + Web App Manifest
- **Hosting**: Firebase Hosting with rewrites

### Project Structure
```
/
├── apps/
│   ├── marketing/           # Landing site served at '/'
│   │   ├── index.html
│   │   ├── App.tsx
│   │   └── install.ts       # A2HS handling
│   └── pwa/                # App served at '/app'
│       ├── index.html
│       ├── App.tsx
│       ├── sw.ts           # Service worker
│       ├── components/
│       │   ├── Feed.tsx    # Main article feed
│       │   ├── Card.tsx    # Article cards
│       │   ├── SoftGate.tsx # Install encouragement
│       │   └── TopBar.tsx  # App header
│       └── lib/
│           ├── firebase.ts
│           ├── articlesApi.ts
│           ├── install.ts
│           └── time.ts
├── scripts/
│   └── seed-articles.ts    # Database seeding
├── firebase.json           # Hosting config
├── firestore.rules        # Security rules
└── storage.rules          # Storage rules
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18+
- Firebase CLI (`npm install -g firebase-tools`)
- Firebase project with Firestore and Storage enabled

### 1. Clone and Install
```bash
git clone <repository-url>
cd canada-plus-news
npm install
```

### 2. Firebase Configuration

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project or select existing one
3. Enable Firestore Database and Storage

#### Configure Firebase
1. Copy your Firebase config from Project Settings
2. Update `apps/pwa/lib/firebase.ts` with your config
3. Update `scripts/seed-articles.ts` with your config

#### Deploy Security Rules
```bash
firebase login
firebase init # Select Firestore and Storage
firebase deploy --only firestore:rules,storage:rules
```

### 3. Seed Sample Data
```bash
# Update Firebase config in scripts/seed-articles.ts first
npx tsx scripts/seed-articles.ts
```

### 4. Development
```bash
# Start marketing site (localhost:3000)
npm run dev:marketing

# Start PWA app (localhost:3001)  
npm run dev:pwa
```

### 5. Build and Deploy
```bash
# Build both apps
npm run build

# Deploy to Firebase Hosting
npm run deploy
```

## 📱 Add to Home Screen Behavior

### Android/Chrome
- Automatic `beforeinstallprompt` handling
- Custom install button in soft gate and marketing
- Native install banner after user engagement

### iOS/Safari  
- Manual "Add to Home Screen" instructions
- Contextual guide shown on demand
- Detection of Safari + iOS for targeted UX

### Detection Logic
- `display-mode: standalone` media query
- `navigator.standalone` for iOS
- IndexedDB fallback for install state

## 🗃️ Data Model

### Articles Collection (`/articles/{id}`)
```typescript
{
  title: string           // Article headline
  summary: string         // 1-3 sentence summary  
  sourceName: string      // Publication name
  originalUrl: string     // Link to full article
  imageUrl: string        // Thumbnail image URL
  topics?: string[]       // ["Politics", "Tech", etc.]
  region?: string         // "Ontario", "National", etc.
  publishedAt: Timestamp  // Publication date
  priority?: number       // Editorial priority (higher = top)
  status: 'published'     // Only published articles shown
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### Security Rules
- **Firestore**: Public read for `status == 'published'`, no public writes
- **Storage**: Public read for `images/articles/**`, no public writes

## 🎨 Design System

### Colors
- **Primary**: Red 600 (#dc2626) - Canada theme
- **Background**: Black for immersive experience
- **Text**: White with opacity variants

### Typography  
- **System fonts** for native feel
- **Responsive sizing** with viewport-based scaling
- **Line clamping** for consistent layouts

### Motion
- **Subtle animations** with `framer-motion`
- **Respects `prefers-reduced-motion`**
- **Smooth scroll-snap** for card navigation

## ♿ Accessibility

### WCAG AA Compliance
- Color contrast ratios ≥ 4.5:1
- Semantic HTML and ARIA labels
- Keyboard navigation support
- Screen reader optimizations

### Features
- Skip links for main content
- Focus management in modals
- Reduced motion support
- High contrast detection

## 🚀 Performance

### Optimization Strategies
- **Code splitting** by route
- **Lazy loading** for images and components  
- **Service Worker** caching for static assets
- **Firestore persistence** for offline access

### Metrics Goals
- **FCP** < 1.5s on 3G
- **LCP** < 2.5s on 3G  
- **PWA** Lighthouse score > 90

## 🔍 SEO & Indexing

### Marketing Site (`/`)
- Full SEO optimization
- Open Graph and Twitter Cards
- Structured data markup
- Indexable content

### PWA App (`/app`)
- `X-Robots-Tag: noindex, nofollow` header
- No direct links from marketing
- App-shell architecture

## 📊 Analytics Events (Console Logging)

- `install_prompt_shown` - Soft gate displayed
- `install_accepted` - PWA installed successfully
- `opened_standalone` - App opened in standalone mode
- `continue_on_web_clicked` - User dismissed install prompt

## 🧪 Testing

```bash
# Run tests
npm test

# Test PWA manifest and SW
npm run build
npm run preview
# Open Chrome DevTools > Application > Manifest
```

## 🚢 Deployment

### Firebase Hosting Configuration
```json
{
  "rewrites": [
    { "source": "/app/**", "destination": "/pwa/index.html" },
    { "source": "/app", "destination": "/pwa/index.html" },  
    { "source": "**", "destination": "/marketing/index.html" }
  ],
  "headers": [
    {
      "source": "/app/**",
      "headers": [{"key": "X-Robots-Tag", "value": "noindex, nofollow"}]
    }
  ]
}
```

### Production Deployment
```bash
npm run build
firebase deploy
```

### Preview Channels
```bash
firebase hosting:channel:deploy preview-feature-x
```

## 🎯 Design Decisions

### PWA Strategy
- **Soft gate** approach balances user choice with install encouragement
- **Dual surface** architecture separates marketing from app functionality
- **Standalone detection** provides optimal experience per context

### Content Strategy  
- **TikTok-style** vertical feed maximizes engagement
- **Scroll-snap** ensures clean card-by-card navigation
- **Summary focus** respects users' time and attention

### Technical Choices
- **Firebase** for rapid development and scaling
- **Tailwind** for maintainable, responsive designs
- **TypeScript** for code quality and developer experience

## 📝 Content Guidelines

### Image Requirements
- **Dimensions**: 600px wide minimum for thumbnails
- **Format**: WebP preferred, JPEG fallback
- **Compression**: Optimized for mobile loading
- **Alt text**: Descriptive for accessibility

### Article Summaries
- **Length**: 1-3 sentences, ~150 characters max
- **Style**: Engaging, informative, mobile-friendly
- **Voice**: Professional but accessible Canadian perspective

## 🔒 Security

### Firebase Rules Testing
```bash
firebase emulators:start --only firestore,storage
# Test with Firebase rules simulator
```

### Content Security Policy
Consider implementing CSP headers for production:
```
Content-Security-Policy: default-src 'self'; img-src 'self' https:; style-src 'self' 'unsafe-inline'
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Standards
- Follow existing TypeScript and React patterns
- Maintain accessibility standards (WCAG AA)
- Test on both mobile and desktop
- Ensure PWA functionality works offline

## 🐛 Troubleshooting

### Common Issues

#### PWA Not Installing
1. Verify HTTPS (required for PWA)
2. Check manifest.json is accessible
3. Ensure service worker registers successfully
4. Test with Chrome DevTools > Application > Manifest

#### Firestore Permission Errors
1. Verify security rules are deployed
2. Check article status is 'published'
3. Ensure Firebase config is correct
4. Test with Firebase emulator for development

#### Images Not Loading
1. Verify Storage rules allow public read
2. Check image URLs are accessible
3. Confirm CORS settings for Firebase Storage
4. Test with different image formats

#### Service Worker Issues
```bash
# Clear service worker cache
# In Chrome DevTools > Application > Storage > Clear Storage
```

### Development Tips
- Use Firebase emulators for local development
- Test install prompts in incognito mode
- Verify offline functionality by disconnecting network
- Test on actual mobile devices, not just desktop responsive mode

## 📚 Additional Resources

### PWA Development
- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [PWA Builder](https://www.pwabuilder.com/)
- [Workbox Documentation](https://developers.google.com/web/tools/workbox)

### Firebase
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)

### Accessibility
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Resources](https://webaim.org/)
- [axe DevTools](https://www.deque.com/axe/devtools/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspired by modern social media UX patterns
- Built with Firebase, React, and the amazing open source community
- Canadian content focus reflects our commitment to local news and perspectives

---

**Canada+ News** - Bringing Canadian stories to your fingertips, one swipe at a time. 🍁
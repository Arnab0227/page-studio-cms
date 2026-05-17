import Link from 'next/link';
import { Button as UIButton } from '@/components/ui/button';
import { ArrowRight, Zap, Layers, Code2 } from 'lucide-react';
import { getPublishedPages } from '@/lib/publishing/getPublishedPages';
import { PublishedPages } from '@/components/home/PublishedPages';
import { NavbarClient } from '@/components/home/NavbarClient';
import { getCurrentUser } from '@/lib/auth/roles';

export default async function HomePage() {
  const publishedPages = await getPublishedPages();
  const user = await getCurrentUser();

  return (
    <main className="min-h-screen bg-white">
      <NavbarClient initialRole={user.role} />
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-gray-900 mb-6">
              Visual Page Builder
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Create stunning pages with a powerful drag-and-drop editor. Powered by Contentful CMS and built with production-ready code.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/editor">
                <UIButton size="lg" className="gap-2">
                  Start Building
                  <ArrowRight size={18} />
                </UIButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PublishedPages pages={publishedPages.slice(0, 6)} />

      <section className="py-20 sm:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16 text-gray-900">
            Powerful Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 border border-gray-200">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Drag & Drop</h3>
              <p className="text-gray-600">
                Intuitive drag-and-drop editor to build pages without writing code.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 border border-gray-200">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Layers className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Reusable Components</h3>
              <p className="text-gray-600">
                Rich library of pre-built components: buttons, cards, sections, and more.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 border border-gray-200">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Code2 className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Contentful CMS</h3>
              <p className="text-gray-600">
                Real CMS integration. Manage content, publish pages, and maintain versions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16 text-gray-900">
            Built with Modern Tech
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { name: 'Next.js 16', desc: 'Latest React framework' },
              { name: 'TypeScript', desc: 'Full type safety' },
              { name: 'Tailwind CSS', desc: 'Utility-first styling' },
              { name: 'Contentful', desc: 'Headless CMS' },
              { name: 'Redux Toolkit', desc: 'State management' },
              { name: 'React Hook Form', desc: 'Form handling' },
              { name: 'Zod', desc: 'Schema validation' },
              { name: 'Playwright', desc: 'E2E testing' },
            ].map((tech, idx) => (
              <div key={idx}>
                <p className="font-semibold text-gray-900 mb-1">{tech.name}</p>
                <p className="text-sm text-gray-600">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-600 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to build?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Create beautiful pages with our visual editor. No coding required.
          </p>
          <Link href="/editor">
            <UIButton size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Open Editor
              <ArrowRight size={18} className="ml-2" />
            </UIButton>
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <p className="font-semibold text-white mb-4">Page Studio</p>
              <p className="text-sm">Professional visual page builder.</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-4">Product</p>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Docs</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-white mb-4">Company</p>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-white mb-4">Legal</p>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-white transition">License</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex items-center justify-between">
            <p className="text-sm">&copy; 2024 Page Studio. All rights reserved.</p>
            <p className="text-sm">Built with Next.js, TypeScript, and Contentful.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

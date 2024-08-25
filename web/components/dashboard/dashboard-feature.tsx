'use client';

import { AppHero } from '../ui/ui-layout';

const links: { label: string; href: string; description: string }[] = [
  {
    label: 'Explore Marketplace',
    href: '/marketplace',
    description: 'Browse and trade real-world asset-backed NFTs in our vibrant marketplace. Find unique assets and connect with other collectors.',
  },
  {
    label: 'Mint Your Assets',
    href: '/mint',
    description: 'Create and mint your own NFTs to add to our marketplace. Customize your assets and make them available for others to explore and purchase.',
  },
  {
    label: 'About BARK Protocol',
    href: '/about',
    description: 'Learn about the mission and vision behind BARK Protocol. Discover how we are revolutionizing asset tokenization and why it matters.',
  },
  {
    label: 'Frequently Asked Questions',
    href: '/faq',
    description: 'Get answers to common questions about using BARK Protocol. Find helpful information on how to get started and troubleshoot common issues.',
  },
  {
    label: 'Visit External Marketplace',
    href: 'https://marketplace.barkprotocol.net',
    description: 'Check out our external marketplace to see a broader selection of real-world asset NFTs and participate in additional trading activities.',
  },
];

/**
 * `DashboardFeature` Component
 *
 * This component serves as the main feature area for the Dashboard page of the BARK application.
 * It includes a hero section with a title and subtitle, as well as a list of important links
 * presented as cards to help users navigate the platform or external resources.
 *
 * Use Cases:
 * - **Onboarding:** Ideal for new users who are exploring the BARK platform for the first time.
 * - **Navigation:** Helps users quickly access key sections like the Marketplace, Minting, About, and FAQ.
 * - **Marketing:** Highlights important external resources or promotions, such as the real-world asset marketplace.
 *
 * @returns {JSX.Element} The rendered component.
 */
export default function DashboardFeature() {
  return (
    <div>
      <AppHero
        title="Real-World Asset Marketplace"
        subtitle="Tokenizing CNFTs and Digital Assets"
      />
      <div className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Key Features</h2>
          <p className="text-lg text-gray-700">
            Explore the core features and resources of the BARK platform. Each card provides an overview of what you can do and where to find additional information.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {links.map((link, index) => (
            <div
              key={index}
              className="card bg-base-100 shadow-xl border border-gray-200 rounded-lg"
            >
              <div className="card-body">
                <h3 className="card-title text-xl font-semibold mb-2">
                  <a
                    href={link.href}
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                  >
                    {link.label}
                  </a>
                </h3>
                <p className="text-gray-700">{link.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

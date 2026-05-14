import Link from 'next/link';

const footerLinks = [
  {
    title: "Shop",
    links: [
      { name: "New Arrivals", href: "/new" },
      { name: "Best Sellers", href: "/best-sellers" },
      { name: "Sale", href: "/sale" },
    ],
  },
  {
    title: "Support",
    links: [
      { name: "Order Tracking", href: "/track" },
      { name: "Returns & Exchanges", href: "/returns" },
      { name: "Shipping Info", href: "/shipping" },
      { name: "FAQs", href: "/faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "/about" },
      { name: "Sustainability", href: "/eco" },
      { name: "Careers", href: "/careers" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900"><span className="font-bold text-xl">
            E - <span className="text-blue-600">COMMERCE</span>
          </span></h2>
           
          </div>

          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-gray-900 mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-gray-600 hover:text-indigo-600 text-sm transition">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">

          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} BrandName. All rights reserved.
          </div>

          <div className="flex items-center space-x-4 grayscale opacity-70">
            <img src="/visa.svg" alt="Visa" className="h-6" />
            <img src="/mastercard.svg" alt="Mastercard" className="h-6" />
            <img src="/paypal.svg" alt="PayPal" className="h-6" />
          </div>
        </div>
      </div>
    </footer>
  );
}

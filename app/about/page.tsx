import Link from 'next/link';
import {
  ArrowLeft,
  BadgeCheck,
  Code2,
  Github,
  Heart,
  Leaf,
  MapPin,
  Smartphone,
  Truck,
  UtensilsCrossed,
} from 'lucide-react';
import BottomNav from '@/components/layout/BottomNav';

const APP_VERSION = '1.0.0';
const APP_RELEASE_YEAR = 2026;
const DEVELOPER_NAME = 'Cizyone';
const GITHUB_URL = 'https://github.com/cizyone/rasa-nyiur';

interface InfoRow {
  label: string;
  value: string;
  icon: React.ReactNode;
  href?: string;
}

const features = [
  {
    icon: <UtensilsCrossed size={18} className="text-primary" />,
    title: 'Menu Khas Manado',
    description: 'Tinutuan, ayam woku, cakalang fufu, panada, dan banyak lagi.',
  },
  {
    icon: <Truck size={18} className="text-primary" />,
    title: 'Pesan Antar & Ambil Sendiri',
    description: 'Antar ke alamat dengan titik GPS presisi, atau ambil di dapur kami.',
  },
  {
    icon: <Smartphone size={18} className="text-primary" />,
    title: 'Pembayaran Fleksibel',
    description: 'QRIS, transfer bank, atau bayar tunai saat pesanan tiba.',
  },
  {
    icon: <Leaf size={18} className="text-primary" />,
    title: 'Ramah Lingkungan',
    description: 'Pilihan alat makan non-plastik untuk mengurangi sampah sekali pakai.',
  },
];

export default function AboutPage() {
  const infoRows: InfoRow[] = [
    {
      label: 'Versi Aplikasi',
      value: `v${APP_VERSION}`,
      icon: <BadgeCheck size={16} className="text-primary" />,
    },
    {
      label: 'Developer',
      value: DEVELOPER_NAME,
      icon: <Code2 size={16} className="text-primary" />,
      href: GITHUB_URL,
    },
    {
      label: 'Platform',
      value: 'Web App (mobile-first)',
      icon: <Smartphone size={16} className="text-primary" />,
    },
    {
      label: 'Lokasi Dapur',
      value: 'Tikala, Manado — Sulawesi Utara',
      icon: <MapPin size={16} className="text-primary" />,
    },
  ];

  return (
    <div className="app-container bg-[#F5F6F5] min-h-screen">
      {/* ── Sticky Header ── */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <Link
          href="/profile"
          className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Kembali ke profil"
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </Link>
        <h1 className="font-bold text-base text-gray-800">Tentang Aplikasi</h1>
      </header>

      <main className="px-4 pt-4 space-y-4">
        {/* ── App identity ── */}
        <section className="bg-white rounded-2xl p-5 text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl mb-3">
            🌴
          </div>
          <h2 className="font-extrabold text-lg text-gray-900">Rasa Nyiur</h2>
          <p className="text-xs text-neutral-500 font-medium mt-0.5">
            Kuliner Khas Manado
          </p>
          <span className="inline-block mt-3 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold">
            Versi {APP_VERSION}
          </span>
        </section>

        {/* ── Short description ── */}
        <section className="bg-white rounded-2xl p-4">
          <h2 className="font-bold text-gray-800 text-sm mb-2">Tentang Rasa Nyiur</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Rasa Nyiur adalah aplikasi pesan antar makanan yang menghadirkan cita rasa
            autentik khas Manado langsung ke meja makanmu. Mulai dari tinutuan yang hangat,
            ayam woku yang pedas segar, hingga cakalang fufu yang gurih — semuanya dimasak
            dengan bahan pilihan dan resep warisan Minahasa.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mt-2">
            Kami percaya makanan terbaik bukan hanya soal rasa, tetapi juga kemudahan:
            pesan dalam beberapa ketukan, tentukan lokasi dengan GPS agar presisi, lalu
            duduk manis menunggu pesanan tiba.
          </p>
        </section>

        {/* ── App information ── */}
        <section className="bg-white rounded-2xl overflow-hidden divide-y divide-gray-50">
          <div className="px-4 pt-4 pb-2">
            <h2 className="font-bold text-gray-800 text-sm">Informasi Aplikasi</h2>
          </div>
          {infoRows.map((row) => {
            const content = (
              <>
                <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  {row.icon}
                </span>
                <span className="flex-1 min-w-0 text-sm font-medium text-gray-500">
                  {row.label}
                </span>
                <span className="text-sm font-semibold text-gray-800 text-right truncate max-w-[55%]">
                  {row.value}
                </span>
              </>
            );

            return row.href ? (
              <a
                key={row.label}
                href={row.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors"
              >
                {content}
              </a>
            ) : (
              <div key={row.label} className="flex items-center gap-3 px-4 py-3.5">
                {content}
              </div>
            );
          })}
        </section>

        {/* ── Features ── */}
        <section className="bg-white rounded-2xl p-4">
          <h2 className="font-bold text-gray-800 text-sm mb-3">Yang Bisa Kamu Lakukan</h2>
          <div className="space-y-3">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-start gap-3">
                <span className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  {feature.icon}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{feature.title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed mt-0.5">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Developer / contact ── */}
        <section className="bg-white rounded-2xl p-4">
          <h2 className="font-bold text-gray-800 text-sm mb-2">Pengembang</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Dikembangkan oleh <span className="font-semibold text-gray-800">{DEVELOPER_NAME}</span>{' '}
            sebagai aplikasi web modern. Punya masukan, laporan bug, atau ide fitur?
            Sampaikan lewat repositori proyek di bawah ini.
          </p>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 px-4 py-2.5 border border-primary text-primary text-xs font-semibold rounded-xl hover:bg-primary/5 transition-colors"
          >
            <Github size={15} />
            github.com/cizyone/rasa-nyiur
          </a>
        </section>

        {/* ── Footer ── */}
        <p className="text-center text-[11px] text-gray-400 leading-relaxed pb-2">
          © {APP_RELEASE_YEAR} Rasa Nyiur. Hak cipta dilindungi.
          <br />
          Dibuat dengan{' '}
          <Heart size={11} className="inline text-red-400 align-[-1px]" /> di Manado, Sulawesi Utara.
        </p>

        {/* Spacer for bottom nav */}
        <div className="h-24" />
      </main>

      <BottomNav />
    </div>
  );
}

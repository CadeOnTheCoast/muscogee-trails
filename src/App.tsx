import {
  ArrowRight,
  Bike,
  Camera,
  Droplets,
  ExternalLink,
  Facebook,
  Fuel,
  Gauge,
  Hammer,
  Heart,
  Map,
  Mountain,
  Pickaxe,
  Route,
  Trees,
  Wrench,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { ConditionReading, getTrailConditionReading } from './services/trailConditions';

type FundingGoal = {
  title: string;
  amount: number;
  current: number;
  description: string;
  importance: string;
  image: string;
  imageAlt: string;
  icon: React.ReactNode;
};

const donateUrl = 'https://www.porc.org/muscogee-trails';

const fundingGoals: FundingGoal[] = [
  {
    title: 'Materials',
    amount: 2500,
    current: 0,
    description: 'Lumber, drainage, fasteners, signs, surfacing, and trail features that turn volunteer hours into durable work.',
    importance: 'Materials are what make repairs last: wood for features, rock for drainage, hardware for safety, and supplies for trail work days.',
    image: '/gallery/rock-garden.jpg',
    imageAlt: 'Rock armoring and drainage work on trail',
    icon: <Hammer className="h-5 w-5" />,
  },
  {
    title: 'Bobcat repair/replace',
    amount: 7500,
    current: 0,
    description: 'Keeping the machine work moving for bigger shaping, drainage fixes, benching, and feature maintenance.',
    importance: 'Machine work handles the heavy shaping that hand tools cannot do efficiently, especially on jumps, drainage, and larger rebuilds.',
    image: '/gallery/dirt-jumps.jpg',
    imageAlt: 'Dirt jumps shaped on the trail system',
    icon: <Wrench className="h-5 w-5" />,
  },
  {
    title: 'New Jumps',
    amount: 5000,
    current: 0,
    description: 'Progressive, maintainable jump lines with room for riders to build skill without skipping safety.',
    importance: 'Progression features give riders a place to improve gradually and keep the trail system exciting for repeat visits.',
    image: '/gallery/jump-line.jpg',
    imageAlt: 'Jump line through pine forest',
    icon: <Mountain className="h-5 w-5" />,
  },
  {
    title: 'Trail Building Equipment',
    amount: 3500,
    current: 0,
    description: 'Hand tools, power tools, safety gear, and layout supplies for volunteer build days.',
    importance: 'Good tools let volunteers work faster, cleaner, and safer when maintaining existing trail and opening new sections.',
    image: '/gallery/wood-feature.jpg',
    imageAlt: 'Wood trail feature in the pines',
    icon: <Pickaxe className="h-5 w-5" />,
  },
  {
    title: 'Fuel',
    amount: 750,
    current: 0,
    description: 'Fuel for machines, hauling, and maintenance days that keep the public trail system moving.',
    importance: 'Fuel keeps work days productive, covering machines, hauling, and support trips for maintenance and build projects.',
    image: '/gallery/skinny-crossing.jpg',
    imageAlt: 'Wood skinny trail crossing',
    icon: <Fuel className="h-5 w-5" />,
  },
];

const facts = [
  { label: 'Trail network', value: '8+ miles', icon: <Route className="h-5 w-5" /> },
  { label: 'Public land', value: '300 acres', icon: <Trees className="h-5 w-5" /> },
  { label: 'Location', value: 'Perdido River', icon: <Map className="h-5 w-5" /> },
];

const galleryPhotos = [
  { src: '/gallery/trail-map-board.jpg', alt: 'Trailhead map board and bike at Muscogee' },
  { src: '/gallery/muscogee-sign.jpg', alt: 'Muscogee Mountain Bike Trails sign' },
  { src: '/gallery/wood-feature.jpg', alt: 'Wood trail feature in the pines' },
  { src: '/gallery/pine-sun.jpg', alt: 'Sun over pine forest at Muscogee' },
  { src: '/gallery/jump-line.jpg', alt: 'Jump line through the woods' },
  { src: '/gallery/skinny-crossing.jpg', alt: 'Wood skinny crossing over brush' },
  { src: '/gallery/rock-garden.jpg', alt: 'Rock garden on singletrack' },
  { src: '/gallery/trail-flower.jpg', alt: 'Wildflower along the trail' },
  { src: '/gallery/grill-day.jpg', alt: 'Trail day food at the shelter' },
  { src: '/gallery/dirt-jumps.jpg', alt: 'Dirt jumps at Muscogee' },
];

const trailforksMapUrl = 'https://www.trailforks.com/widgets/region_map/?rid=27702&width=100%25&height=560&activitytype=1&maptype=trailforks&trailstyle=difficulty&controls=1';

function Currency({ value }: { value: number }) {
  return <>{value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}</>;
}

function Inches({ millimeters }: { millimeters?: number }) {
  if (millimeters === undefined) return <>--</>;
  return <>{(millimeters / 25.4).toFixed(2)}</>;
}

function DonutProgress({ current, goal }: { current: number; goal: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(100, Math.round((current / goal) * 100));
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative h-40 w-40">
      <motion.svg
        viewBox="0 0 140 140"
        className="h-full w-full"
        initial={{ rotate: -120 }}
        animate={{ rotate: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#eadfca" strokeWidth="16" />
        <motion.circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="#a6532f"
          strokeLinecap="round"
          strokeWidth="16"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference, rotate: -90 }}
          animate={{ strokeDashoffset: 0, rotate: 270 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          style={{ transformOrigin: '70px 70px' }}
        />
        <motion.circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="#2f8f5b"
          strokeLinecap="round"
          strokeWidth="16"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference, rotate: -90 }}
          animate={{ strokeDashoffset: offset, rotate: -90 }}
          transition={{ duration: 0.9, delay: 0.55, ease: 'easeOut' }}
          style={{ transformOrigin: '70px 70px' }}
        />
      </motion.svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="text-3xl font-black text-pine">{percentage}%</p>
          <p className="text-xs font-black uppercase tracking-wide text-ink/55">funded</p>
        </div>
      </div>
    </div>
  );
}

function Navbar() {
  const isGallery = window.location.pathname === '/gallery';
  const links = [
    { label: 'Conditions', href: isGallery ? '/#conditions' : '#conditions' },
    { label: 'Fundraising', href: isGallery ? '/#fundraising' : '#fundraising' },
    { label: 'Map', href: isGallery ? '/#map' : '#map' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Connect', href: isGallery ? '/#connect' : '#connect' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f8f7f1]/92 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#" className="flex items-center gap-3 font-bold tracking-wide text-pine">
          <span className="grid h-10 w-10 place-items-center rounded bg-pine text-white">
            <Bike className="h-5 w-5" />
          </span>
          <span className="leading-tight">
            Muscogee
            <span className="block text-xs font-semibold uppercase tracking-[0.22em] text-clay">MTB Trails</span>
          </span>
        </a>
        <a href={isGallery ? '/#fundraising' : '#fundraising'} className="inline-flex items-center gap-2 rounded bg-clay px-3 py-2 text-xs font-black uppercase tracking-wide text-white shadow-sm transition hover:bg-[#8d4223] md:hidden">
          <Heart className="h-4 w-4" />
          Donate
        </a>
        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="rounded px-3 py-2 text-sm font-bold uppercase tracking-wide text-ink/75 transition hover:bg-pine/10 hover:text-pine">
              {link.label}
            </a>
          ))}
          <a href={isGallery ? '/#fundraising' : '#fundraising'} className="ml-2 inline-flex items-center gap-2 rounded bg-clay px-4 py-2 text-sm font-bold uppercase tracking-wide text-white shadow-sm transition hover:bg-[#8d4223]">
            <Heart className="h-4 w-4" />
            Donate
          </a>
        </div>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[680px] overflow-hidden bg-ink text-white">
      <img src="/muscogee-trails-hero-real.jpg" alt="" className="absolute inset-0 h-full w-full object-cover object-[58%_58%] sm:object-[60%_56%] lg:object-[64%_58%]" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/6" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#f8f7f1] to-transparent" />

      <div className="relative mx-auto flex min-h-[680px] max-w-7xl flex-col justify-center px-4 pb-16 pt-20 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded border border-white/30 bg-white/12 px-3 py-2 text-sm font-bold uppercase tracking-[0.2em] backdrop-blur">
            <Trees className="h-4 w-4 text-sand" />
            Pensacola area public singletrack
          </div>
          <h1 className="font-display text-5xl font-black leading-[0.95] tracking-normal sm:text-7xl lg:text-8xl">
            Muscogee Mountain Bike Trails
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/88 sm:text-xl">
            Purpose-built singletrack along the Perdido River, maintained by volunteers and grown through community support.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#fundraising" className="inline-flex items-center justify-center gap-2 rounded bg-clay px-6 py-3 text-sm font-black uppercase tracking-wide text-white shadow-lg transition hover:bg-[#8d4223]">
              Support the build <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#map" className="inline-flex items-center justify-center gap-2 rounded border border-white/35 bg-white/12 px-6 py-3 text-sm font-black uppercase tracking-wide text-white backdrop-blur transition hover:bg-white/20">
              View trail links <Map className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function TrailConditionGauge() {
  const [reading, setReading] = useState<ConditionReading | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    getTrailConditionReading()
      .then(setReading)
      .catch(() => setError(true));
  }, []);

  const wetness = reading?.wetness ?? 34;
  const needleRotation = -105 + wetness * 2.1;

  return (
    <section id="conditions" className="bg-[#f8f7f1] py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-clay">Advisory trail gauge</p>
          <h2 className="mt-3 font-display text-4xl font-black text-pine sm:text-5xl">Wet to dry at a glance</h2>
        </div>

        <div className="rounded border border-black/10 bg-white p-6 shadow-trail">
          <div className="grid gap-6 md:grid-cols-[260px_1fr] md:items-center">
            <div className="relative mx-auto aspect-[1.45/1] w-full max-w-[290px] overflow-hidden">
              <div className="absolute inset-x-0 bottom-0 aspect-[2/1] rounded-t-full bg-gradient-to-r from-[#d96b4f] via-[#d7bc62] to-[#3f8d64]" />
              <div className="absolute inset-x-[10%] bottom-0 aspect-[2/1] rounded-t-full bg-white" />
              <div className="absolute bottom-0 left-1/2 h-2 w-[42%] origin-left rounded-full bg-ink shadow-md transition-transform duration-700" style={{ transform: `rotate(${needleRotation}deg)` }} />
              <div className="absolute bottom-[-10px] left-1/2 h-8 w-8 -translate-x-1/2 rounded-full border-4 border-white bg-ink" />
              <div className="absolute bottom-3 left-2 text-xs font-black uppercase tracking-wide text-ink/60">Wet</div>
              <div className="absolute bottom-3 right-2 text-xs font-black uppercase tracking-wide text-ink/60">Dry</div>
            </div>
            <div>
              <div className="flex items-center gap-3 text-pine">
                <Gauge className="h-6 w-6" />
                <h3 className="text-2xl font-black">{error ? 'Condition unavailable' : reading?.label ?? 'Checking rain data'}</h3>
              </div>
              <p className="mt-3 leading-7 text-ink/70">
                {error ? 'Weather data could not be loaded. Check local rainfall before riding.' : reading?.summary ?? 'Loading current rainfall estimate.'}
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded bg-[#f4f0e5] p-3">
                  <p className="text-xs font-black uppercase tracking-wide text-ink/55">24h rain</p>
                  <p className="mt-1 text-xl font-black text-ink"><Inches millimeters={reading?.rain24h} /> in</p>
                </div>
                <div className="rounded bg-[#f4f0e5] p-3">
                  <p className="text-xs font-black uppercase tracking-wide text-ink/55">72h rain</p>
                  <p className="mt-1 text-xl font-black text-ink"><Inches millimeters={reading?.rain72h} /> in</p>
                </div>
                <div className="rounded bg-[#f4f0e5] p-3">
                  <p className="text-xs font-black uppercase tracking-wide text-ink/55">Source</p>
                  <p className="mt-1 text-sm font-black text-ink">{reading?.source ?? 'Open-Meteo'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FundingCard({ goal, onSelect }: { goal: FundingGoal; onSelect: (goal: FundingGoal) => void }) {
  const percent = Math.min(100, Math.round((goal.current / goal.amount) * 100));

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(goal)}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.45 }}
      className="rounded border border-black/10 bg-white p-5 text-left shadow-sm transition hover:border-clay hover:shadow-trail focus:outline-none focus:ring-4 focus:ring-sand/70"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="grid h-11 w-11 place-items-center rounded bg-pine text-white">{goal.icon}</div>
        <p className="text-2xl font-black text-clay">
          <Currency value={goal.amount} />
        </p>
      </div>
      <h3 className="mt-5 text-xl font-black text-ink">{goal.title}</h3>
      <p className="mt-3 min-h-[84px] leading-7 text-ink/68">{goal.description}</p>
      <div className="mt-5 h-3 overflow-hidden rounded-full bg-[#e7dec7]">
        <div className="h-full rounded-full bg-gradient-to-r from-clay to-river" style={{ width: `${percent}%` }} />
      </div>
      <div className="mt-3 flex justify-between text-sm font-bold text-ink/55">
        <span><Currency value={goal.current} /> raised</span>
        <span>{percent}%</span>
      </div>
      <p className="mt-4 text-xs font-black uppercase tracking-wide text-pine">View goal</p>
    </motion.button>
  );
}

function FundingGoalModal({ goal, onClose }: { goal: FundingGoal | null; onClose: () => void }) {
  if (!goal) return null;

  const percent = Math.min(100, Math.round((goal.current / goal.amount) * 100));

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[80] overflow-y-auto bg-ink/70 px-4 py-6 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="funding-goal-title"
          className="mx-auto max-w-5xl overflow-hidden rounded border border-white/20 bg-[#f8f7f1] shadow-2xl"
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.98 }}
          transition={{ duration: 0.25 }}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative min-h-[320px] bg-ink">
              <img src={goal.image} alt={goal.imageAlt} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
            </div>
            <div className="relative p-6 sm:p-8">
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded bg-white text-ink shadow-sm transition hover:bg-sand focus:outline-none focus:ring-4 focus:ring-sand/70"
                aria-label="Close funding goal"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="pr-10">
                <p className="text-sm font-black uppercase tracking-[0.24em] text-clay">Fundraising goal</p>
                <h3 id="funding-goal-title" className="mt-2 font-display text-4xl font-black leading-tight text-pine sm:text-5xl">{goal.title}</h3>
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-[180px_1fr] md:items-center">
                <DonutProgress current={goal.current} goal={goal.amount} />
                <div>
                  <p className="text-4xl font-black text-clay"><Currency value={goal.amount} /></p>
                  <p className="mt-2 text-sm font-black uppercase tracking-wide text-ink/55">
                    <Currency value={goal.current} /> raised · {percent}% funded
                  </p>
                  <p className="mt-5 leading-7 text-ink/75">{goal.description}</p>
                  <p className="mt-4 leading-7 text-ink/75">{goal.importance}</p>
                </div>
              </div>

              <a
                href={donateUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded bg-clay px-6 py-4 text-base font-black uppercase tracking-wide text-white shadow-lg transition hover:bg-[#8d4223] focus:outline-none focus:ring-4 focus:ring-clay/30"
              >
                <Heart className="h-5 w-5 fill-current" />
                Donate to {goal.title}
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Fundraising() {
  const [selectedGoal, setSelectedGoal] = useState<FundingGoal | null>(null);
  const total = useMemo(() => fundingGoals.reduce((sum, goal) => sum + goal.amount, 0), []);

  return (
    <section id="fundraising" className="bg-[#17201b] py-16 text-white sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-sand">Fundraising goals</p>
            <h2 className="mt-3 font-display text-4xl font-black sm:text-5xl">Help build the next phase</h2>
          </div>
          <div className="rounded border border-white/15 bg-white/8 p-6">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-white/55">Total target</p>
            <p className="mt-2 text-5xl font-black text-sand">
              <Currency value={total} />
            </p>
            <a href="https://www.porc.org/muscogee-trails" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded bg-sand px-5 py-3 text-sm font-black uppercase tracking-wide text-ink transition hover:bg-white">
              Donate through PORC <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {fundingGoals.map((goal) => (
            <FundingCard key={goal.title} goal={goal} onSelect={setSelectedGoal} />
          ))}
        </div>
      </div>
      <FundingGoalModal goal={selectedGoal} onClose={() => setSelectedGoal(null)} />
    </section>
  );
}

function TrailInfo() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          {facts.map((fact) => (
            <div key={fact.label} className="rounded border border-black/10 bg-[#f8f7f1] p-5">
              <div className="flex items-center gap-3 text-pine">
                {fact.icon}
                <p className="text-sm font-black uppercase tracking-[0.2em] text-ink/55">{fact.label}</p>
              </div>
              <p className="mt-4 text-3xl font-black text-ink">{fact.value}</p>
            </div>
          ))}
        </div>

        <div id="map" className="mt-12 grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-river">Plan a ride</p>
            <h2 className="mt-3 font-display text-4xl font-black text-pine sm:text-5xl">Trail map and access</h2>
            <p className="mt-5 text-lg leading-8 text-ink/72">
              Muscogee is a public trail system near Pensacola with community-built singletrack and ongoing expansion work.
            </p>
          </div>

          <div className="overflow-hidden rounded border border-black/10 bg-[#f8f7f1] shadow-trail">
            <iframe
              title="Trailforks map of Muscogee MTB Trails"
              src={trailforksMapUrl}
              className="block h-[560px] w-full border-0"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <a href="https://www.porc.org/muscogee-trails" target="_blank" rel="noreferrer" className="group flex items-center justify-between rounded border border-black/10 bg-[#f8f7f1] p-5 font-black text-ink transition hover:border-pine hover:bg-pine hover:text-white">
              PORC Muscogee Trails <ExternalLink className="h-5 w-5 transition group-hover:translate-x-1" />
            </a>
            <a href="https://www.trailforks.com/region/muscogee-mtb-trails-27702/" target="_blank" rel="noreferrer" className="group flex items-center justify-between rounded border border-black/10 bg-[#f8f7f1] p-5 font-black text-ink transition hover:border-pine hover:bg-pine hover:text-white">
              Trailforks map <ExternalLink className="h-5 w-5 transition group-hover:translate-x-1" />
            </a>
            <a href="/gallery" className="group flex items-center justify-between rounded border border-black/10 bg-[#f8f7f1] p-5 font-black text-ink transition hover:border-pine hover:bg-pine hover:text-white">
              Photo gallery <Camera className="h-5 w-5 transition group-hover:translate-x-1" />
            </a>
            <a href="https://www.facebook.com/groups/448148798865409/" target="_blank" rel="noreferrer" className="group flex items-center justify-between rounded border border-black/10 bg-[#f8f7f1] p-5 font-black text-ink transition hover:border-pine hover:bg-pine hover:text-white">
              Facebook community <Facebook className="h-5 w-5 transition group-hover:translate-x-1" />
            </a>
        </div>
      </div>
    </section>
  );
}

function GalleryPage() {
  return (
    <main className="bg-[#f8f7f1]">
      <section className="bg-ink px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-sand">Muscogee MTB Trails</p>
          <h1 className="mt-3 font-display text-5xl font-black leading-tight sm:text-6xl">Gallery</h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
          {galleryPhotos.map((photo) => (
            <a key={photo.src} href={photo.src} className="mb-5 block break-inside-avoid overflow-hidden rounded border border-black/10 bg-white shadow-sm">
              <img src={photo.src} alt={photo.alt} className="w-full object-cover transition duration-300 hover:scale-[1.02]" loading="lazy" />
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}

function Connect() {
  return (
    <section id="connect" className="bg-[#f8f7f1] py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <Droplets className="mx-auto h-10 w-10 text-river" />
        <h2 className="mt-4 font-display text-4xl font-black text-pine sm:text-5xl">Built by riders, for riders</h2>
        <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-ink/72">
          Support the work, watch for volunteer days, and help keep the trail system sustainable for the next wave of Gulf Coast riders.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a href="https://www.facebook.com/groups/448148798865409/" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded bg-pine px-6 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-ink">
            Join the group <Facebook className="h-4 w-4" />
          </a>
          <a href="https://www.porc.org/muscogee-trails" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded border border-pine px-6 py-3 text-sm font-black uppercase tracking-wide text-pine transition hover:bg-pine hover:text-white">
            PORC info <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const isGallery = window.location.pathname === '/gallery';

  return (
    <div className="min-h-screen bg-[#f8f7f1]">
      <Navbar />
      {isGallery ? (
        <GalleryPage />
      ) : (
        <main>
          <Hero />
          <TrailConditionGauge />
          <Fundraising />
          <TrailInfo />
          <Connect />
        </main>
      )}
      <footer className="border-t border-black/10 bg-white px-4 py-8 text-center text-sm font-semibold text-ink/55">
        Muscogee Mountain Bike Trails fundraiser concept. Weather estimates are advisory.
      </footer>
    </div>
  );
}

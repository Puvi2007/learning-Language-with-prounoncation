import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Languages, Mic, Trophy, Zap, CheckCircle, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-background text-text overflow-x-hidden transition-colors duration-300 relative">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b border-primary/20 bg-surface/80 backdrop-blur-md shadow-[0_0_20px_rgba(0,229,255,0.1)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 border border-primary shadow-[0_0_15px_rgba(0,229,255,0.4)]">
              <Languages className="text-primary" />
            </div>
            <span className="text-2xl font-black tracking-tight text-text text-shadow-glow">Neo<span className="text-primary">Lingo</span></span>
          </div>
          
          <div className="hidden space-x-8 md:flex">
            <a href="#features" className="text-sm font-bold uppercase tracking-wide text-text-muted hover:text-primary transition-colors">Features</a>
            <a href="#languages" className="text-sm font-bold uppercase tracking-wide text-text-muted hover:text-primary transition-colors">Languages</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-bold uppercase tracking-wide text-primary hover:text-primary-dark transition-colors">Login</Link>
            <Link to="/signup" className="btn-duo btn-duo-primary shadow-[0_0_15px_rgba(0,229,255,0.3)]">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="absolute top-0 left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none animate-pulse"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="mb-6 text-5xl font-black leading-tight tracking-tight sm:text-7xl text-text text-shadow-glow">
                Initialize your <span className="text-primary">neural link</span> to language!
              </h1>
              <p className="mb-8 text-xl text-text-muted leading-relaxed">
                Master Indian regional languages with our AI-powered pronunciation guide. 
                Learn Tamil and Telugu through 14 days of gamified activities.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link to="/signup" className="btn-duo btn-duo-primary px-8 py-4 text-lg">
                  Start Learning Now
                </Link>
                <Link to="/login" className="btn-duo btn-duo-outline px-8 py-4 text-lg bg-surface border-primary/30 text-primary">
                  System Access
                </Link>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 overflow-hidden rounded-[2.5rem] border border-primary/30 bg-surface shadow-[0_0_40px_rgba(0,229,255,0.15)] backdrop-blur-md">
                <img 
                  src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=1000" 
                  alt="Students learning" 
                  className="h-full w-full object-cover opacity-60 mix-blend-luminosity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-primary/20"></div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-primary/20 border border-primary animate-pulse shadow-[0_0_20px_rgba(0,229,255,0.5)] backdrop-blur-xl flex items-center justify-center">
                <Zap className="text-primary" />
              </div>
              <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-3xl bg-accent/20 border border-accent rotate-12 -z-10 animate-pulse shadow-[0_0_20px_rgba(168,85,247,0.5)]"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-surface/50 border-y border-primary/10 py-24 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-black tracking-tight sm:text-5xl text-text">System Capabilities</h2>
            <p className="text-lg text-primary font-bold tracking-widest uppercase">Powered by advanced neural networks.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              { 
                icon: <Mic className="h-8 w-8 text-primary" />, 
                title: "Voice Sync", 
                desc: "Real-time acoustic analysis of your pronunciation using cybernetic speech recognition." 
              },
              { 
                icon: <Zap className="h-8 w-8 text-accent" />, 
                title: "Gamified Hub", 
                desc: "Earn XP, maintain operational streaks, and unlock database sectors as you progress." 
              },
              { 
                icon: <Trophy className="h-8 w-8 text-secondary" />, 
                title: "Data Badges", 
                desc: "Acquire verified cryptographic certificates upon sequence completion." 
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="rounded-3xl border border-primary/20 bg-surface p-8 shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all hover:shadow-[0_0_30px_rgba(0,229,255,0.2)] hover:border-primary/50"
              >
                <div className="mb-6 inline-block rounded-2xl bg-background border border-primary/20 p-4 shadow-[inset_0_0_15px_rgba(0,229,255,0.1)]">{feature.icon}</div>
                <h3 className="mb-3 text-2xl font-bold text-text">{feature.title}</h3>
                <p className="text-text-muted leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Languages Section */}
      <section id="languages" className="py-24 relative">
        <div className="absolute right-[-10%] top-[20%] w-[30%] h-[30%] bg-secondary/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row mb-16">
            <div className="text-center md:text-left">
              <h2 className="mb-4 text-4xl font-black tracking-tight sm:text-5xl text-text">Available Modules</h2>
              <p className="text-lg text-text-muted">Initialize learning protocols for these key regions.</p>
            </div>
            <Link to="/signup" className="btn-duo btn-duo-accent">Access Terminal</Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 max-w-2xl mx-auto">
            {['Tamil', 'Telugu'].map((lang, i) => (
              <div key={i} className="group relative overflow-hidden rounded-3xl border border-primary/30 bg-surface p-8 transition-all hover:border-primary hover:bg-primary/10 shadow-[0_0_15px_rgba(0,229,255,0.05)] hover:shadow-[0_0_30px_rgba(0,229,255,0.2)]">
                <div className="mb-4 text-4xl font-black text-primary/20 group-hover:text-primary/40 transition-colors">0{i+1}</div>
                <h3 className="text-3xl font-black text-text">{lang}</h3>
                <div className="mt-4 flex items-center gap-2 text-primary opacity-0 transition-opacity group-hover:opacity-100 font-bold uppercase tracking-widest text-xs">
                  Initialize Link <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Showcase */}
      <section className="bg-surface-solid border-y border-primary/20 py-24 text-text relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <div className="relative rounded-3xl bg-background p-8 shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-primary/30">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,229,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,229,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none rounded-3xl" />
                <div className="mb-8 flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-danger shadow-[0_0_10px_var(--danger)]"></div>
                    <div className="h-3 w-3 rounded-full bg-warning shadow-[0_0_10px_var(--warning)]"></div>
                    <div className="h-3 w-3 rounded-full bg-success shadow-[0_0_10px_var(--success)]"></div>
                  </div>
                  <div className="rounded-full bg-primary/10 border border-primary/30 px-4 py-1 text-xs font-bold text-primary uppercase tracking-widest shadow-[0_0_10px_rgba(0,229,255,0.2)]">Live Feedback</div>
                </div>
                
                <div className="space-y-6 relative z-10">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-surface border border-primary/30 flex items-center justify-center shadow-[inset_0_0_10px_rgba(0,229,255,0.2)]">🤖</div>
                    <div className="rounded-2xl bg-surface border border-primary/20 p-4 text-sm font-medium text-text">Say: "வணக்கம்" (Vanakkam)</div>
                  </div>
                  <div className="flex items-start justify-end gap-4">
                    <div className="rounded-2xl bg-primary/20 border border-primary p-4 text-sm font-bold text-primary shadow-[0_0_15px_rgba(0,229,255,0.2)]">"Vanakkam"</div>
                    <div className="h-10 w-10 rounded-full bg-surface border border-primary/30 flex items-center justify-center text-primary shadow-[inset_0_0_10px_rgba(0,229,255,0.2)]">👤</div>
                  </div>
                  <div className="rounded-2xl border border-primary/50 bg-primary/10 p-6 text-center shadow-[0_0_20px_rgba(0,229,255,0.15)] backdrop-blur-md">
                    <div className="mb-2 text-3xl font-black text-primary text-shadow-glow">98% Sync Rate</div>
                    <div className="text-xs text-text-muted uppercase font-bold tracking-[0.3em]">Perfect Pronunciation!</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="mb-6 text-4xl font-black leading-tight sm:text-5xl tracking-tight text-text">
                Neural networks that understand <span className="text-primary text-shadow-glow">you</span> perfectly.
              </h2>
              <ul className="space-y-4">
                {[
                  "Real-time acoustic wave analysis",
                  "Phonetic breakdown of every data packet",
                  "Personalized recalibration sessions",
                  "Native speaker audio algorithm comparisons"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-lg text-text-muted">
                    <CheckCircle className="h-6 w-6 text-primary drop-shadow-[0_0_8px_var(--primary)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary/20 bg-background py-12 relative overflow-hidden">
        <div className="absolute bottom-0 left-[50%] translate-x-[-50%] w-[60%] h-[100px] bg-primary/20 blur-[80px] pointer-events-none rounded-full"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid gap-12 md:grid-cols-4">
            <div className="col-span-2">
              <div className="mb-6 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 border border-primary shadow-[0_0_10px_rgba(0,229,255,0.3)]">
                  <Languages className="text-primary" />
                </div>
                <span className="text-2xl font-black tracking-tight text-text">Neo<span className="text-primary">Lingo</span></span>
              </div>
              <p className="max-w-xs text-text-muted leading-relaxed">
                Empowering language learners through cutting-edge cybernetics and neural gamification. 
                Built for the future.
              </p>
            </div>
            <div>
              <h4 className="mb-6 text-sm font-black uppercase tracking-widest text-text">System</h4>
              <ul className="space-y-4 text-sm font-bold text-text-muted">
                <li><Link to="/login" className="hover:text-primary transition-colors">Login</Link></li>
                <li><Link to="/signup" className="hover:text-primary transition-colors">Access Terminal</Link></li>
                <li><Link to="/dashboard" className="hover:text-primary transition-colors">Hub</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-6 text-sm font-black uppercase tracking-widest text-text">Network</h4>
              <ul className="space-y-4 text-sm font-bold text-text-muted">
                <li><a href="#twitter" className="hover:text-primary transition-colors">Twitter</a></li>
                <li><a href="#linkedin" className="hover:text-primary transition-colors">LinkedIn</a></li>
                <li><a href="#instagram" className="hover:text-primary transition-colors">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-primary/20 pt-8 text-center text-sm font-bold text-text-muted">
            © 2026 NeoLingo Core. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

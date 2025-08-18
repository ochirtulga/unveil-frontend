import React from 'react';
import { Layout, Container } from '../layout/Layout';

interface AboutProps {
  className?: string;
}

export const About: React.FC<AboutProps> = ({ className = '' }) => {
  return (
    <Layout className={className}>
      <Container size="md">
        <div className="py-16 max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-light text-slate-900 mb-6 tracking-tight">
              About Unveil
            </h1>
            <p className="text-lg text-slate-600 font-light leading-relaxed">
              Protecting communities through transparent, community-driven scam verification.
            </p>
          </div>

          {/* Mission Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-light text-slate-900 mb-6 tracking-wide">
              Our Mission
            </h2>
            <div className="space-y-6 text-slate-700 font-light leading-relaxed">
              <p>
                Every day, millions of people fall victim to scams, fraud, and deceptive practices. 
                Traditional reporting systems are slow, fragmented, and often ineffective at preventing 
                real-time harm.
              </p>
              <p>
                Unveil creates a comprehensive, searchable database where communities can quickly 
                verify suspicious contacts, report new threats, and collectively determine the 
                legitimacy of reported cases through democratic voting.
              </p>
              <p>
                By making scam information immediately accessible and actionable, we empower 
                individuals to protect themselves and help others avoid falling victim to the 
                same schemes.
              </p>
            </div>
          </section>

          {/* How It Works */}
          <section className="mb-16">
            <h2 className="text-2xl font-light text-slate-900 mb-8 tracking-wide">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <ProcessStep 
                number="01"
                title="Search & Verify"
                description="Instantly search our database by name, email, phone, or company to verify suspicious contacts."
              />
              <ProcessStep 
                number="02"
                title="Community Voting"
                description="Community members vote on case legitimacy, creating transparent, democratic verdicts."
              />
              <ProcessStep 
                number="03"
                title="Real-time Protection"
                description="Get immediate access to verified scam information and protect yourself and others."
              />
            </div>
          </section>

          {/* Values */}
          <section className="mb-16">
            <h2 className="text-2xl font-light text-slate-900 mb-8 tracking-wide">
              Our Values
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <ValueItem 
                title="Transparency"
                description="All case information and voting results are publicly accessible. No hidden algorithms or biased moderation."
              />
              <ValueItem 
                title="Community-Driven"
                description="Verdicts are determined by community voting, not corporate interests or automated systems."
              />
              <ValueItem 
                title="Privacy Focused"
                description="We only collect information necessary for scam prevention and protect user privacy."
              />
              <ValueItem 
                title="Accessibility"
                description="Free access to all scam verification tools. Protection shouldn't be a privilege."
              />
            </div>
          </section>

          {/* Statistics */}
          {/* <section className="mb-16">
            <div className="bg-slate-50 p-8 rounded-lg">
              <h2 className="text-2xl font-light text-slate-900 mb-8 text-center tracking-wide">
                Community Impact
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <StatItem number="50,000+" label="Verified Cases" />
                <StatItem number="1M+" label="Users Protected" />
                <StatItem number="250,000+" label="Community Votes" />
                <StatItem number="99.2%" label="Accuracy Rate" />
              </div>
            </div>
          </section> */}

          {/* Team */}
          <section className="mb-16">
            <h2 className="text-2xl font-light text-slate-900 mb-6 tracking-wide">
              Built for Everyone
            </h2>
            <div className="text-slate-700 font-light leading-relaxed space-y-4">
              <p>
                Unveil is built by a team passionate about creating safer digital communities. 
                We believe that collective intelligence and transparency are the most effective 
                tools against fraud and deception.
              </p>
              <p>
                Our platform is designed to be simple, fast, and accessible to everyone – 
                from tech-savvy users to those just learning to navigate online safety.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="text-center">
            <h2 className="text-2xl font-light text-slate-900 mb-6 tracking-wide">
              Join the Mission
            </h2>
            <div className="space-y-4">
              <p className="text-slate-600 font-light leading-relaxed max-w-2xl mx-auto">
                Help us build a safer internet. Report suspicious activity, vote on cases, 
                and spread awareness about scam prevention in your community.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mt-8">
                <a 
                  href="/report" 
                  className="px-6 py-3 bg-slate-900 text-white hover:bg-slate-800 transition-colors font-medium tracking-wide"
                >
                  Report a Case
                </a>
                <a 
                  href="/" 
                  className="px-6 py-3 text-slate-600 hover:text-slate-900 transition-colors font-light tracking-wide"
                >
                  Start Searching
                </a>
              </div>
            </div>
          </section>
        </div>
      </Container>
    </Layout>
  );
};

// Process Step Component
interface ProcessStepProps {
  number: string;
  title: string;
  description: string;
}

const ProcessStep: React.FC<ProcessStepProps> = ({ number, title, description }) => {
  return (
    <div className="text-center">
      <div className="text-3xl font-light text-slate-300 mb-3 tracking-wide">
        {number}
      </div>
      <h3 className="text-lg font-light text-slate-900 mb-3 tracking-wide">
        {title}
      </h3>
      <p className="text-slate-600 font-light leading-relaxed text-sm">
        {description}
      </p>
    </div>
  );
};

// Value Item Component
interface ValueItemProps {
  title: string;
  description: string;
}

const ValueItem: React.FC<ValueItemProps> = ({ title, description }) => {
  return (
    <div>
      <h3 className="text-lg font-light text-slate-900 mb-3 tracking-wide">
        {title}
      </h3>
      <p className="text-slate-600 font-light leading-relaxed text-sm">
        {description}
      </p>
    </div>
  );
};

// Stat Item Component
interface StatItemProps {
  number: string;
  label: string;
}

const StatItem: React.FC<StatItemProps> = ({ number, label }) => {
  return (
    <div className="text-center">
      <div className="text-2xl font-light text-slate-900 mb-1">
        {number}
      </div>
      <div className="text-xs text-slate-500 font-light tracking-wide uppercase">
        {label}
      </div>
    </div>
  );
};
import { getSite, getServices } from '@/lib/site';
import { Hero } from '@/components/Hero';
import { Services } from '@/components/Services';
import { Process } from '@/components/Process';
import { Advantages } from '@/components/Advantages';
import { LeadForm } from '@/components/LeadForm';

export default async function HomePage() {
  const [site, services] = await Promise.all([getSite(), getServices()]);

  return (
    <main>
      <Hero site={site} />
      <Services services={services} />
      <Process />
      <Advantages advantages={site.advantages} />
      <LeadForm site={site} services={services} />
    </main>
  );
}

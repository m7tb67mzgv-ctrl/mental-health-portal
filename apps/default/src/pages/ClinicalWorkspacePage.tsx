import { useAuth } from 'react-oidc-context';
import { ArrowLeft, ClipboardList, Database, FileText, ShieldAlert, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PORTAL_NAME } from '@/config/portal';

const areas = [
  {
    id: 'chart',
    title: 'Patient chart',
    eyebrow: '01 · Chart',
    description: 'A future patient-centered view for the longitudinal record and encounters.',
    icon: ClipboardList,
    note: 'No patient charts are connected or displayed.',
  },
  {
    id: 'notes',
    title: 'Clinical notes',
    eyebrow: '02 · Notes',
    description: 'A future workspace for encounter-linked clinical documentation.',
    icon: FileText,
    note: 'No clinical notes are collected or saved in this shell.',
  },
  {
    id: 'groups',
    title: 'Group notes',
    eyebrow: '03 · Groups',
    description: 'A future workspace for group-session documentation and its record model.',
    icon: Users,
    note: 'No group sessions or participant records are connected.',
  },
];

export default function ClinicalWorkspacePage() {
  const auth = useAuth();
  const isAdmin = auth.isAuthenticated && auth.user?.profile.role === 'admin';

  if (!isAdmin) {
    return (
      <main className="grid min-h-screen place-items-center bg-background px-5 py-10 text-foreground">
        <section className="w-full max-w-xl rounded-3xl border border-border/70 bg-card/75 p-8 shadow-xl">
          <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary"><ShieldAlert className="size-5" aria-hidden="true" /></span>
          <h1 className="mt-6 text-3xl font-semibold">Clinical workspace preview</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">This page follows the portal’s existing app-admin display check. It is not server-side authorization. No clinical records are connected here.</p>
          <Link to="/admin" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"><ArrowLeft className="size-4" aria-hidden="true" />Back to staff workspace</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">

      <div className="mx-auto w-full max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <section className="relative isolate overflow-hidden rounded-[2rem] border border-border/60 bg-card/70 p-7 shadow-xl shadow-primary/5 backdrop-blur-lg sm:p-10">
          <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 size-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Phoenix · Clinical records</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Clinical workspace</h1>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">A no-PHI starting shell for the chart, clinical notes, and group notes. The openEHR repository, templates, Supabase connection, and Keragon workflow have not been selected or connected.</p>
          </div>
        </section>

        <aside className="mt-6 rounded-2xl border border-border/70 bg-muted/70 p-5 sm:p-6" aria-label="Connection and access status">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
            <div className="min-w-0">
              <h2 className="font-semibold">No clinical data is connected</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">This shell does not read or write clinical records. Supabase row-level policies and server-enforced therapist/admin permissions are not configured here. The portal’s current patient-intake data path has not been changed by this shell.</p>
            </div>
          </div>
        </aside>

        <section className="pt-10" aria-labelledby="areas-heading">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Record areas</p>
            <h2 id="areas-heading" className="mt-2 text-2xl font-semibold">Three foundations, ready for a backend</h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {areas.map((area) => {
              const Icon = area.icon;
              return (
                <article key={area.id} className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-lg shadow-black/5 backdrop-blur-md sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary"><Icon className="size-5" aria-hidden="true" /></span>
                    <span className="rounded-full border border-border/70 px-3 py-1 text-xs font-medium text-muted-foreground">Not connected</span>
                  </div>
                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-primary">{area.eyebrow}</p>
                  <h3 className="mt-2 text-xl font-semibold">{area.title}</h3>
                  <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">{area.description}</p>
                  <a href={`#${area.id}`} className="mt-5 inline-flex min-h-11 items-center rounded-xl border border-border/70 px-4 text-sm font-medium hover:bg-accent">View section</a>
                </article>
              );
            })}
          </div>
        </section>

        <div className="mt-8 space-y-5">
          {areas.map((area) => {
            const Icon = area.icon;
            return (
              <section key={area.id} id={area.id} className="scroll-mt-28 rounded-3xl border border-border/70 bg-card/60 p-5 backdrop-blur-md sm:p-7" aria-labelledby={`${area.id}-heading`}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary"><Icon className="size-5" aria-hidden="true" /></span>
                    <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">{area.eyebrow}</p><h2 id={`${area.id}-heading`} className="mt-1 text-xl font-semibold">{area.title}</h2></div>
                  </div>
                  <span className="rounded-full border border-border/70 px-3 py-1 text-xs font-medium text-muted-foreground">Empty shell</span>
                </div>
                <div className="mt-5 rounded-2xl border border-dashed border-border p-5">
                  <p className="text-sm font-medium">{area.note}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">No entry form is enabled. This section cannot save information.</p>
                </div>
              </section>
            );
          })}
        </div>

        <section className="mt-8 rounded-3xl border border-border/70 bg-card/70 p-5 sm:p-7" aria-labelledby="openehr-heading">
          <div className="flex items-start gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary"><Database className="size-5" aria-hidden="true" /></span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Modeling direction</p>
              <h2 id="openehr-heading" className="mt-1 text-xl font-semibold">OpenEHR-guided, not yet modeled</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">openEHR is the record-modeling and interoperability guide here, not a connected record repository. Select the platform and archetypes/templates before defining how charts and notes map to compositions, versions, and queries.</p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              ['Repository', 'No openEHR platform selected'],
              ['Backend', 'Supabase not connected'],
              ['Workflow bridge', 'Keragon not connected'],
            ].map(([label, value]) => <div key={label} className="rounded-2xl border border-border/60 bg-background/60 p-4"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-sm font-medium">{value}</p></div>)}
          </div>
        </section>

        <footer className="mt-8 border-t border-border/70 pt-5 text-xs leading-5 text-muted-foreground">{PORTAL_NAME} · Clinical workspace shell · Contains no clinical records</footer>
      </div>
    </main>
  );
}

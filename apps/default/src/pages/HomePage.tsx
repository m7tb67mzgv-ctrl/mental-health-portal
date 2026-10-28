import { useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { ArrowRight, CalendarDays, CheckCircle2, CircleDollarSign, ClipboardCheck, ShieldCheck, Video } from 'lucide-react';

import { createNode } from '@/lib/genesis-data';
import { PORTAL_PROJECTS } from '@/config/portal';

type RequestKind = 'appointment' | 'insurance' | 'payment';

function Panel({ icon: Icon, eyebrow, title, children }: { icon: typeof CalendarDays; eyebrow: string; title: string; children: React.ReactNode }) {
  return <section className="rounded-3xl border border-border/70 bg-card/75 p-6 shadow-lg shadow-black/5 backdrop-blur-md sm:p-8"><div className="mb-6 flex items-start gap-4"><span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary"><Icon className="size-5" aria-hidden /></span><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p><h2 className="mt-2 text-xl font-semibold tracking-tight">{title}</h2></div></div>{children}</section>;
}

function Input({ label, name, type = 'text', required = false, placeholder, autoComplete }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string; autoComplete?: string }) {
  return <label className="grid min-w-0 gap-2 text-sm font-medium text-foreground">{label}<input name={name} type={type} required={required} placeholder={placeholder} autoComplete={autoComplete} className="min-h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-normal outline-none transition focus-visible:ring-2 focus-visible:ring-ring" /></label>;
}

function SubmitButton({ saving, children }: { saving: boolean; children: string }) {
  return <button type="submit" disabled={saving} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60">{saving ? 'Saving request…' : children}<ArrowRight className="size-4" aria-hidden /></button>;
}

export default function HomePage() {
  const auth = useAuth();
  const [saving, setSaving] = useState<RequestKind | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function saveRequest(event: React.FormEvent<HTMLFormElement>, kind: RequestKind) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const patientName = String(data.get('patientName') ?? '').trim();
    setMessage('');
    setError('');
    if (!patientName) {
      setError('Add your name so the care team can route your request.');
      return;
    }
    setSaving(kind);
    try {
      let projectId = PORTAL_PROJECTS.appointments;
      let values: Record<string, string | number> = { '/text': patientName };
      if (kind === 'appointment') {
        const email = String(data.get('email') ?? '').trim();
        const localDate = String(data.get('appointmentDate') ?? '').trim();
        if (!email || !localDate) throw new Error('Add your email and a preferred date and time.');
        projectId = PORTAL_PROJECTS.appointments;
        values = {
          '/text': patientName,
          'Patient Name': patientName,
          'Patient Email': email,
          Provider: 'Care team to assign',
          'Visit Type': String(data.get('visitType') ?? 'Therapy'),
          'Appointment Date': new Date(localDate).toISOString(),
          Status: 'Requested',
          'Reminder Status': 'Pending',
        };
      } else if (kind === 'insurance') {
        const payer = String(data.get('payer') ?? '').trim();
        const memberId = String(data.get('memberId') ?? '').trim();
        if (!payer || !memberId) throw new Error('Add your payer and member ID for staff review.');
        projectId = PORTAL_PROJECTS.insurance;
        values = {
          '/text': patientName,
          'Patient Name': patientName,
          Payer: payer,
          'Member ID': memberId,
          'Verification Status': 'In Review',
          Notes: 'Patient-submitted information awaiting care team review.',
        };
        const groupNumber = String(data.get('groupNumber') ?? '').trim();
        const copay = String(data.get('estimatedCopay') ?? '').trim();
        if (groupNumber) values['Group Number'] = groupNumber;
        if (copay !== '') values['Estimated Copay'] = Number(copay);
      } else {
        const amount = String(data.get('amount') ?? '').trim();
        if (amount === '' || Number(amount) < 0) throw new Error('Add the copay or deductible amount you were asked to track.');
        projectId = PORTAL_PROJECTS.payments;
        values = {
          '/text': patientName,
          'Patient Name': patientName,
          'Amount Due': Number(amount),
          'Payment Status': 'Due',
          Notes: 'Patient requested payment follow-up. No payment was collected in this portal.',
        };
      }
      const result = await createNode(projectId, values);
      if (result.ignoredKeys.length > 0) throw new Error('Some details could not be saved. Please review the form and try again.');
      form.reset();
      setMessage(kind === 'appointment' ? 'Your visit request was saved. The care team must confirm the time.' : kind === 'insurance' ? 'Your coverage details were saved for staff review. This portal does not contact your insurer.' : 'Your payment step was recorded. This portal does not collect or charge a payment.');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'We could not save that request. Please try again.');
    } finally {
      setSaving(null);
    }
  }

  return <main className="min-h-screen overflow-hidden bg-background text-foreground">

    <div id="home" className="mx-auto w-full max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8 lg:pt-12">
      <section className="relative isolate overflow-hidden rounded-[2rem] border border-border/60 bg-card/70 p-7 shadow-xl shadow-primary/5 backdrop-blur-lg sm:p-12">
        <div aria-hidden className="pointer-events-none absolute -right-20 -top-24 size-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div><span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary"><ShieldCheck className="size-3.5" aria-hidden /> Care, made easier to coordinate</span><h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">Your next step in care, all in one place.</h1><p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">Request a telehealth visit, share coverage details for staff review, and keep copay or deductible steps organized.</p></div>
          <div className="rounded-3xl border border-border/70 bg-background/70 p-5 sm:p-6"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">A note about requests</p><p className="mt-3 text-sm leading-6 text-muted-foreground">A submitted visit time is a request, not a confirmed booking. Coverage is reviewed by the care team, and payment tracking here does not charge your card.</p><div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground"><CheckCircle2 className="size-4 text-primary" aria-hidden />You will see a saved confirmation after each request.</div></div>
        </div>
      </section>

      {(message || error) ? <div role={error ? 'alert' : 'status'} className={`mt-6 rounded-2xl border p-4 text-sm ${error ? 'border-destructive/30 bg-destructive/5 text-foreground' : 'border-primary/25 bg-primary/10 text-foreground'}`}>{message || error}</div> : null}

      <div className="mt-8 grid items-start gap-5 lg:grid-cols-3">
        <Panel icon={CalendarDays} eyebrow="01 · Visits" title="Request a telehealth visit">
          <form onSubmit={(event) => void saveRequest(event, 'appointment')} className="grid gap-4">
            <Input label="Your name" name="patientName" required autoComplete="name" />
            <Input label="Email" name="email" type="email" required autoComplete="email" />
            <label className="grid gap-2 text-sm font-medium">Visit type<select name="visitType" defaultValue="Therapy" className="min-h-11 rounded-xl border border-input bg-background px-3 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring"><option>Therapy</option><option>Psychiatry</option><option>New Patient Intake</option></select></label>
            <Input label="Preferred date and time" name="appointmentDate" type="datetime-local" required />
            <p className="text-xs leading-5 text-muted-foreground">The care team confirms a time after checking real availability.</p>
            <SubmitButton saving={saving === 'appointment'}>Send visit request</SubmitButton>
          </form>
        </Panel>

        <Panel icon={ClipboardCheck} eyebrow="02 · Coverage" title="Share insurance details">
          <form onSubmit={(event) => void saveRequest(event, 'insurance')} className="grid gap-4">
            <Input label="Your name" name="patientName" required autoComplete="name" />
            <Input label="Insurance payer" name="payer" required placeholder="Payer name" />
            <Input label="Member ID" name="memberId" required autoComplete="off" />
            <Input label="Group number (optional)" name="groupNumber" autoComplete="off" />
            <Input label="Estimated copay (optional)" name="estimatedCopay" type="number" placeholder="Amount shared by your plan" />
            <p className="text-xs leading-5 text-muted-foreground">A staff member reviews these details. This portal does not verify benefits with an insurer. Do not enter payment card or Social Security numbers.</p>
            <SubmitButton saving={saving === 'insurance'}>Send for review</SubmitButton>
          </form>
        </Panel>

        <Panel icon={CircleDollarSign} eyebrow="03 · Payments" title="Track a copay or deductible step">
          <form onSubmit={(event) => void saveRequest(event, 'payment')} className="grid gap-4">
            <Input label="Your name" name="patientName" required autoComplete="name" />
            <Input label="Amount to track" name="amount" type="number" required placeholder="0.00" />
            <p className="text-xs leading-5 text-muted-foreground">This records an amount for follow-up only. No card details are accepted and no payment is processed here.</p>
            <SubmitButton saving={saving === 'payment'}>Record payment step</SubmitButton>
          </form>
        </Panel>
      </div>

      <section className="mt-8 grid gap-5 md:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-border/70 bg-card/70 p-6 backdrop-blur-md sm:p-8"><div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary"><Video className="size-5" aria-hidden /></span><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Telehealth care</p><h2 className="mt-1 text-lg font-semibold">Your team will confirm the details</h2></div></div><p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">Real appointment openings are added by staff. Until availability is entered, use the visit form to send a preferred time for review.</p></div>
        <div className="rounded-3xl border border-border/70 bg-card/70 p-6 backdrop-blur-md sm:p-8"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Need help?</p><h2 className="mt-2 text-lg font-semibold">Ask the Phoenix Portal Guide</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">Open the chat button to ask the Phoenix Portal Guide how to use this portal. It cannot see your appointments, verify coverage, give clinical advice, or handle emergencies.</p><p className="mt-4 text-xs text-muted-foreground">For urgent or emergency help, contact local emergency services.</p></div>
      </section>
      <footer className="mt-12 border-t border-border/70 pt-5 text-xs leading-5 text-muted-foreground">For care coordination only. This portal is not an emergency service. Signed in as {String(auth.user?.profile.email ?? 'your account')}.</footer>
    </div>
  </main>;
}

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center p-6 text-center">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">404</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Admin page not found</h1>
        <Link className="mt-6 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white" href="/dashboard">
          Return to dashboard
        </Link>
      </div>
    </main>
  );
}

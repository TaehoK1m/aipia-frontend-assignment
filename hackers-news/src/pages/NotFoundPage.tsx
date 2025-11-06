import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section className="flex flex-col items-center gap-4 py-20 text-center">
      <h1 className="text-4xl font-bold text-slate-50">Page not found</h1>
      <p className="text-sm text-slate-400">
        The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-brand-dark"
      >
        Back to stories
      </Link>
    </section>
  );
}

export default NotFoundPage;

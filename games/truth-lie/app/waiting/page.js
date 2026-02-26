import Link from "next/link";
import { Suspense } from "react";
import WaitingRoom from "../../components/WaitingRoom";

export default function WaitingPage() {
  return (
    <main className="tl-shell tl-stack-lg">
      <Suspense fallback={<section className="tl-card"><p className="tl-muted">Cargando sala de espera...</p></section>}>
        <WaitingRoom />
      </Suspense>

      <div className="tl-inline-actions">
        <Link className="btn btn-outlined" href="/">
          Inicio
        </Link>
      </div>
    </main>
  );
}

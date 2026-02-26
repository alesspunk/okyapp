import Link from "next/link";
import HostDashboard from "../../components/HostDashboard";

export default function HostPage() {
  return (
    <main className="tl-shell tl-stack-lg">
      <HostDashboard />

      <div className="tl-inline-actions">
        <Link className="btn btn-outlined" href="/board">
          Abrir board público
        </Link>
        <Link className="btn btn-secondary" href="/">
          Inicio
        </Link>
      </div>
    </main>
  );
}

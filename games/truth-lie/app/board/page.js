import Link from "next/link";
import PublicBoard from "../../components/PublicBoard";

export default function BoardPage() {
  return (
    <main className="tl-shell tl-stack-lg">
      <PublicBoard />

      <div className="tl-inline-actions">
        <Link className="btn btn-secondary" href="/join">
          Unirse como jugador
        </Link>
        <Link className="btn btn-outlined" href="/host">
          Ir a host
        </Link>
      </div>
    </main>
  );
}

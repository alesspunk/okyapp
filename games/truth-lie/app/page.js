import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="tl-shell">
      <section className="tl-card tl-hero">
        <p className="tl-kicker">OKY · Multiplayer Zoom Game</p>
        <h1>Two Truths & One Lie</h1>
        <p className="tl-lead">
          Cada participante envía 3 enunciados. El host controla el orden, inicia rondas y revela la mentira.
        </p>

        <div className="tl-inline-actions">
          <Link className="btn btn-primary" href="/join">
            Soy jugador
          </Link>
          <Link className="btn btn-secondary" href="/host">
            Soy host
          </Link>
          <Link className="btn btn-outlined" href="/board">
            Ver board
          </Link>
        </div>
      </section>
    </main>
  );
}

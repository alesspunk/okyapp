import Link from "next/link";
import JoinForm from "../../components/JoinForm";

export default function JoinPage() {
  return (
    <main className="tl-shell tl-stack-lg">
      <section className="tl-card">
        <p className="tl-kicker">Participante</p>
        <h1>Unirse al juego</h1>
        <p className="tl-muted">
          Escribe tus 3 enunciados y marca cuál es la mentira (privada para el reveal del host).
        </p>
      </section>

      <section className="tl-card tl-rules-card">
        <h3>Reglas del juego</h3>
        <ol className="tl-rules-list">
          <li>Escribe 3 enunciados sobre ti: 2 verdaderos y 1 falso.</li>
          <li>Hazlos claros y cortos para que todos puedan votar rápido.</li>
          <li>Solo tú y el host saben cuál es la mentira hasta el reveal.</li>
          <li>Cuando el host te active, todos adivinan tu mentira en Zoom.</li>
          <li>Al final del reveal, el host pasa al siguiente jugador.</li>
        </ol>
      </section>

      <JoinForm />

      <div className="tl-inline-actions">
        <Link className="btn btn-outlined" href="/">
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}

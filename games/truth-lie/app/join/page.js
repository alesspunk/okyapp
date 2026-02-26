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

      <JoinForm />

      <div className="tl-inline-actions">
        <Link className="btn btn-outlined" href="/">
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}

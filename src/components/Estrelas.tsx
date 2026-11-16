// Cinco estrelas com preenchimento proporcional à nota (ex.: 4,8 = 4 cheias + 80% da última).
export default function Estrelas({
  nota,
  tamanho = 16,
  className = "",
}: {
  nota: number;
  tamanho?: number;
  className?: string;
}) {
  return (
    <span
      role="img"
      aria-label={`Nota ${nota.toFixed(1).replace(".", ",")} de 5`}
      className={`inline-flex items-center gap-[2px] text-brand ${className}`}
    >
      {[0, 1, 2, 3, 4].map((i) => {
        const preenchido = Math.max(0, Math.min(1, nota - i));
        return (
          <span key={i} className="relative inline-block" style={{ width: tamanho, height: tamanho }}>
            <Estrela tamanho={tamanho} vazada />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${preenchido * 100}%` }}>
              <Estrela tamanho={tamanho} />
            </span>
          </span>
        );
      })}
    </span>
  );
}

function Estrela({ tamanho, vazada = false }: { tamanho: number; vazada?: boolean }) {
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill={vazada ? "none" : "currentColor"}
      stroke="currentColor"
      strokeWidth={vazada ? 1.6 : 0}
      strokeLinejoin="round"
      aria-hidden="true"
      className="block"
    >
      <path d="M12 1.8l3.1 6.6 7.2.9-5.3 5 1.4 7.2L12 18l-6.4 3.5L7 14.3l-5.3-5 7.2-.9z" />
    </svg>
  );
}

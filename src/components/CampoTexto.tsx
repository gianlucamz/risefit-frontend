// Campo de formulário simples (rótulo + input + dica/erro) no padrão do layout.
export default function CampoTexto({
  id,
  rotulo,
  erro,
  dica,
  obrigatorio = false,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  rotulo: string;
  erro?: string;
  dica?: string;
  obrigatorio?: boolean;
}) {
  const descricao = erro ? `${id}-erro` : dica ? `${id}-dica` : undefined;

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-dark">
        {rotulo}
        {obrigatorio && <span aria-hidden="true"> *</span>}
      </label>
      <input
        id={id}
        name={id}
        aria-invalid={Boolean(erro)}
        aria-describedby={descricao}
        required={obrigatorio}
        {...props}
        className={`h-14 w-full rounded-md border bg-white px-4 text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/20 disabled:bg-gray-50 disabled:text-gray-500 ${
          erro ? "border-red-500" : "border-gray-300 focus:border-brand"
        }`}
      />
      {erro ? (
        <p id={`${id}-erro`} className="mt-2 text-xs text-red-600">
          {erro}
        </p>
      ) : (
        dica && (
          <p id={`${id}-dica`} className="mt-2 text-xs text-gray-500">
            {dica}
          </p>
        )
      )}
    </div>
  );
}

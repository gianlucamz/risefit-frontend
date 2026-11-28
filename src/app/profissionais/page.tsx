import ProfissionaisBanner from "@/components/ProfissionaisBanner";
import ProfissionaisExplorar from "@/components/ProfissionaisExplorar";
import {
  mapearProfissionalAPI,
  obterProfissionaisAPI,
  type Profissional,
} from "@/services/api";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Profissionais | RiseFit",
};

export default async function Profissionais() {
  let profissionaisIniciais: Profissional[] = [];
  let erroInicial = false;

  try {
    const listaApi = await obterProfissionaisAPI();
    profissionaisIniciais = Array.isArray(listaApi)
      ? listaApi.map(mapearProfissionalAPI)
      : [];
  } catch {
    erroInicial = true;
  }

  return (
    <main>
      <ProfissionaisBanner />
      <ProfissionaisExplorar
        profissionaisIniciais={profissionaisIniciais}
        erroInicial={erroInicial}
      />
    </main>
  );
}
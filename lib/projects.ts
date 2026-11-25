import { getProductById, getStockForStore } from "./catalog";
import { DEFAULT_STORE_ID } from "./stores";
import { DynamicProjectList, ProjectItem, TutorialStep } from "./types";

type ItemSpec = {
  productId: string;
  quantity?: number;
  optional?: boolean;
  reason?: string;
};

export function materializeProjectItems(
  specs: ItemSpec[],
  storeId: string
): ProjectItem[] {
  const items: ProjectItem[] = [];

  for (const spec of specs) {
    const prod = getProductById(spec.productId);
    if (!prod) continue;

    const stockQty = getStockForStore(prod, storeId);
    const sub = prod.substituteId ? getProductById(prod.substituteId) : undefined;
    const subStock = sub ? getStockForStore(sub, storeId) : 0;

    items.push({
      productId: prod.id,
      name: prod.name,
      brand: prod.brand,
      leroyExclusive: prod.leroyExclusive,
      imageUrl: prod.imageUrl,
      sku: prod.sku,
      category: prod.category,
      price: prod.price,
      unit: prod.unit,
      quantity: spec.quantity ?? 1,
      aisle: prod.aisle,
      corridorCode: prod.corridorCode,
      shelfLocation: prod.shelfLocation,
      stockQty,
      inStock: stockQty > 0,
      optional: spec.optional,
      reason: spec.reason,
      substituteId: sub && subStock > 0 ? sub.id : undefined,
      substituteName: sub && subStock > 0 ? sub.name : undefined,
      substitutePrice: sub && subStock > 0 ? sub.price : undefined,
      substituteAisle: sub && subStock > 0 ? sub.aisle : undefined,
      substituteShelf: sub && subStock > 0 ? sub.shelfLocation : undefined,
      substituteStockQty: sub && subStock > 0 ? subStock : undefined,
    });
  }

  return items;
}

const TUTORIALS: Record<string, TutorialStep[]> = {
  "reparo-torneira": [
    {
      step: 1,
      title: "Feche o registro geral do cômodo",
      detail: "Gire o registro da parede do banheiro ou cozinha até interromper totalmente o fluxo de água e abra a torneira para aliviar a pressão.",
      durationMin: 2,
      safetyWarning: "Nunca desmonte a torneira com o registro aberto — pode jorrar água sob pressão.",
    },
    {
      step: 2,
      title: "Remova o volante (acabamento) e o reparo antigo",
      detail: "Retire a tampinha superior do volante, solte o parafuso central com a chave de fenda e desrosqueie o mecanismo interno antigo.",
      durationMin: 5,
      tip: "Leve um pano embaixo para não perder o parafuso no ralo (feche o ralo antes!).",
    },
    {
      step: 3,
      title: "Aplique o veda-rosca e instale o reparo novo",
      detail: "Dê 5 a 6 voltas de fita veda-rosca no sentido horário na rosca do reparo universal e rosqueie firmemente sem forçar demais.",
      durationMin: 5,
    },
    {
      step: 4,
      title: "Reabra o registro e teste a vedação",
      detail: "Recoloque o volante, abra o registro aos poucos e verifique se o gotejamento parou completamente.",
      durationMin: 3,
    },
  ],
  "troca-torneira": [
    {
      step: 1,
      title: "Feche o registro e desconecte o engate flexível",
      detail: "Feche o registro da parede, abra a torneira para esvaziar o cano e use a chave inglesa para soltar o engate embaixo da pia.",
      durationMin: 4,
      safetyWarning: "Deixe um balde ou pano embaixo da bancada para aparar a água residual.",
    },
    {
      step: 2,
      title: "Retire a torneira antiga e limpe a bancada",
      detail: "Desrosqueie a porca de fixação por baixo da pia, puxe a torneira antiga e limpe resíduos de silicone ou sujeira.",
      durationMin: 5,
    },
    {
      step: 3,
      title: "Posicione a torneira nova e aplique veda-rosca",
      detail: "Encaixe a nova torneira com o anel de vedação, aperte a porca inferior e aplique 6 voltas de veda-rosca nas conexões.",
      durationMin: 8,
      tip: "Alinhe a bica exatamente no centro do ralo antes do aperto final.",
    },
    {
      step: 4,
      title: "Reconecte o engate e abra o registro",
      detail: "Aperte o engate flexível com a chave inglesa, abra o registro devagar e cheque se há gotas nas conexões inferiores.",
      durationMin: 3,
    },
  ],
  "troca-sifao": [
    {
      step: 1,
      title: "Coloque um balde embaixo e retire o sifão antigo",
      detail: "Desrosqueie a porca superior presa à válvula da pia e desencaixe a ponta inferior do tubo da parede.",
      durationMin: 4,
    },
    {
      step: 2,
      title: "Ajuste o anel adaptador e encaixe o sifão universal",
      detail: "Use o anel correspondente ao diâmetro da válvula da sua pia, rosqueie bem firme com a mão (sem usar alicate para não trincar o plástico).",
      durationMin: 5,
      tip: "Forme uma curva em 'U' (fecho hídrico) no meio do sifão — é essa água parada que bloqueia o mau cheiro do esgoto.",
    },
    {
      step: 3,
      title: "Teste com água corrente",
      detail: "Deixe a torneira aberta por 1 minuto e passe um pano seco nas emendas para confirmar 100% de vedação.",
      durationMin: 2,
    },
  ],
  "pintura-quarto": [
    {
      step: 1,
      title: "Proteja o ambiente antes de abrir a tinta",
      detail: "Estenda a lona plástica no piso, cubra móveis e aplique fita crepe nos rodapés, batentes e espelhos de tomadas.",
      durationMin: 15,
      tip: "Remover as tampas das tomadas (com disjuntor desligado) deixa o acabamento profissional.",
    },
    {
      step: 2,
      title: "Prepare e lixe a superfície",
      detail: "Passe a lixa grão 120 suavemente para remover imperfeições e limpe o pó com pano levemente úmido. Se a parede for nova ou muito escura, aplique o selador/fundo preparador.",
      durationMin: 20,
    },
    {
      step: 3,
      title: "Faça os recortes com a trincha",
      detail: "Pinte primeiro as bordas próximas ao teto, quinas e rodapés com o pincel trincha 2\" criando uma moldura de 5cm.",
      durationMin: 20,
    },
    {
      step: 4,
      title: "Aplique 2 demãos com o rolo antigotas",
      detail: "Dilua a tinta conforme a lata (10–20% água limpa), passe o rolo em movimentos de 'W' e aguarde 4 horas entre a 1ª e a 2ª demão.",
      durationMin: 60,
      tip: "Retire a fita crepe enquanto a 2ª demão ainda estiver levemente úmida para não puxar película de tinta.",
    },
  ],
  "reparo-trinca": [
    {
      step: 1,
      title: "Higienize e abra levemente a trinca",
      detail: "Se houver mofo, aplique o removedor de mofo e espere secar. Raspe tinta solta com a espátula formando um pequeno 'V' limpo na fissura.",
      durationMin: 15,
      safetyWarning: "Se a trinca ultrapassar 3mm de abertura, for diagonal em viga/pilar ou continuar aumentando, acione um especialista.",
    },
    {
      step: 2,
      title: "Aplique a fita telada sobre a fissura",
      detail: "Cole a fita telada autoadesiva centralizada ao longo de toda a trinca. Ela absorve microdilatações e impede que a rachadura volte.",
      durationMin: 5,
    },
    {
      step: 3,
      title: "Cubra com massa acrílica e lixe após secagem",
      detail: "Espalhe 2 camadas finas de massa acrílica com a espátula ultrapassando 5cm de cada lado. Após 4h de secagem, lixe com grão 120 até nivelar.",
      durationMin: 20,
    },
    {
      step: 4,
      title: "Sele e repinte o trecho",
      detail: "Em áreas úmidas (banheiro), aplique impermeabilizante antes da tinta final para bloquear o retorno de bolhas e mofo.",
      durationMin: 15,
    },
  ],
  "instalar-prateleira": [
    {
      step: 1,
      title: "Meça e marque os furos com o nível de bolha",
      detail: "Encoste a prateleira/suporte na altura desejada, use o nível de bolha para alinhar perfeitamente na horizontal e marque os furos a lápis.",
      durationMin: 8,
      safetyWarning: "Antes de furar, verifique se não passa cano de água ou eletroduto na vertical de torneiras e tomadas.",
    },
    {
      step: 2,
      title: "Fure com a broca correta para a bucha",
      detail: "Use broca vídea 8mm para buchas S8 (alvenaria) na profundidade do parafuso + 5mm. Em drywall, use a broca indicada para bucha borboleta.",
      durationMin: 8,
      tip: "Prenda um envelope de papel dobrado com fita crepe logo abaixo do furo para capturar toda a poeira.",
    },
    {
      step: 3,
      title: "Fixe buchas, suportes e a prateleira",
      detail: "Encaixe as buchas rente à parede, parafuse as mãos francesas firmemente, apoie a prateleira MDF e prenda os parafusos inferiores.",
      durationMin: 10,
    },
  ],
  "troca-resistencia": [
    {
      step: 1,
      title: "DESLIGUE o disjuntor do chuveiro e confirme",
      detail: "Vá ao quadro de luz, desligue o disjuntor específico do chuveiro e use a chave teste de tensão para ter 100% de certeza de que não há corrente.",
      durationMin: 3,
      safetyWarning: "Obrigatório desligar o disjuntor antes de encostar em qualquer parte do chuveiro.",
    },
    {
      step: 2,
      title: "Abra o espalhador e troque o refil da resistência",
      detail: "Desrosqueie a tampa inferior, puxe o cartucho queimado e encaixe a resistência nova na mesma posição (respeitando os contatos A, B e C).",
      durationMin: 7,
    },
    {
      step: 3,
      title: "Revise os fios com conector Wago (se necessário)",
      detail: "Se notar fios escurecidos ou fita derretida, substitua a emenda por conectores Wago 32A — encaixe rápido e seguro contra superaquecimento.",
      durationMin: 8,
    },
    {
      step: 4,
      title: "Deixe correr água fria antes de religar a energia",
      detail: "Com o disjuntor AINDA DESLIGADO, abra o registro do chuveiro por 30 segundos até encher a câmara de água. Só depois ligue o disjuntor.",
      durationMin: 2,
      safetyWarning: "Religar o disjuntor com o chuveiro seco queima a resistência nova instantaneamente!",
    },
  ],
  "trocar-iluminacao": [
    {
      step: 1,
      title: "Desligue o interruptor e o disjuntor de iluminação",
      detail: "Para troca de plafon/painel de teto, desligue o disjuntor e confirme ausência de energia com a chave teste.",
      durationMin: 3,
      safetyWarning: "Nunca trabalhe em fiação de teto confiando apenas no interruptor desligado.",
    },
    {
      step: 2,
      title: "Fixe o suporte e conecte o driver LED",
      detail: "Parafuse a haste metálica na caixa do teto, conecte os fios usando conector Wago ou fita isolante antichama bem firme.",
      durationMin: 10,
    },
    {
      step: 3,
      title: "Encaixe o plafon e religue a energia",
      detail: "Acomode o driver dentro do corpo do painel, prenda nas travas laterais e teste o acendimento.",
      durationMin: 4,
    },
  ],
};

export function buildPaintingProject(params: {
  storeId: string;
  widthM: number;
  lengthM: number;
  includeCeiling: boolean;
  color: "azul" | "branco";
  finish: "fosco" | "acetinado";
}): DynamicProjectList {
  const { storeId, widthM, lengthM, includeCeiling, color, finish } = params;
  const heightM = 2.8;
  const perimeter = 2 * (widthM + lengthM);
  const wallArea = Math.max(8, Math.round(perimeter * heightM - 2.6)); // desconta porta/janela média
  const ceilingArea = includeCeiling ? Math.round(widthM * lengthM) : 0;
  const totalArea = wallArea + ceilingArea;
  // Rendimento prático médio: ~9,5 m² por litro por demão → 2 demãos
  const litersNeeded = Math.ceil((totalArea * 2) / 9.5);

  const useLargeCan = litersNeeded > 9;
  const paintProductId =
    color === "azul"
      ? useLargeCan
        ? "tin-acrilica-18l-azul"
        : "tin-acrilica-36l-azul"
      : finish === "acetinado" || useLargeCan
      ? "tin-acrilica-18l-branco"
      : "tin-acrilica-36l-branco";

  const paintQty = useLargeCan
    ? Math.max(1, Math.ceil(litersNeeded / 18))
    : Math.max(1, Math.ceil(litersNeeded / 3.6));

  const specs: ItemSpec[] = [
    {
      productId: paintProductId,
      quantity: paintQty,
      reason: `Calculado para ${totalArea}m² em 2 demãos (~${litersNeeded}L necessários)`,
    },
    { productId: "tin-rolo-bandeja", quantity: 1, reason: "Aplicação uniforme sem respingos" },
    { productId: "tin-trincha", quantity: 1, reason: "Recortes em cantos e rodapés" },
    { productId: "tin-fita-crepe", quantity: 1, reason: "Proteção de batentes e rodapés" },
    { productId: "tin-lona", quantity: 1, reason: "Proteção do piso e móveis" },
    { productId: "tin-lixa-120", quantity: 1, reason: "Nivelamento antes da pintura" },
    {
      productId: "tin-selador",
      quantity: 1,
      optional: true,
      reason: "Opcional: recomendado para parede nova ou cobertura de cor escura",
    },
  ];

  if (includeCeiling && color !== "branco") {
    specs.splice(1, 0, {
      productId: "tin-acrilica-36l-branco",
      quantity: Math.max(1, Math.ceil((ceilingArea * 2) / 28)),
      reason: `Tinta branca dedicada para o teto (${ceilingArea}m²)`,
    });
  }

  const colorLabel = color === "azul" ? "azul sereno" : "branco neve";
  const finishLabel = finish === "acetinado" ? "acetinado" : "fosco";
  const id = `pintura-${widthM}x${lengthM}-${color}-${includeCeiling ? "teto" : "parede"}`.replace(
    /\./g,
    "_"
  );

  return {
    id,
    title: `Pintura ${widthM}×${lengthM}m (${colorLabel})`,
    subtitle: `${totalArea}m² calculados · 2 demãos · acabamento ${finishLabel}`,
    description: `Cálculo automático para cômodo de ${widthM}×${lengthM}m (pé-direito 2,80m)${
      includeCeiling ? " incluindo teto" : ", somente paredes"
    }. Estimativa de ${litersNeeded}L de tinta com todos os acessórios de preparação e proteção.`,
    storeId,
    difficulty: "Fácil",
    estimatedInstallMin: 120,
    sourceIntent: "pintura",
    calculationNote: `Área útil: ${wallArea}m² de paredes${
      includeCeiling ? ` + ${ceilingArea}m² de teto` : ""
    } = ${totalArea}m² × 2 demãos → ~${litersNeeded}L de tinta.`,
    items: materializeProjectItems(specs, storeId),
    tutorial: TUTORIALS["pintura-quarto"],
    createdAt: Date.now(),
  };
}

export function getPresetProject(
  id: string,
  storeId: string = DEFAULT_STORE_ID
): DynamicProjectList | null {
  switch (id) {
    case "reparo-torneira":
      return {
        id: "reparo-torneira",
        title: "Reparo de torneira pingando",
        subtitle: "Troca da vedação interna · solução rápida e econômica",
        description:
          "Kit completo para eliminar o gotejamento trocando apenas o mecanismo interno (reparo) da torneira — resolve cerca de 80% dos casos sem precisar trocar a peça inteira.",
        storeId,
        difficulty: "Fácil",
        estimatedInstallMin: 15,
        sourceIntent: "torneira",
        items: materializeProjectItems(
          [
            { productId: "hid-reparo-univ", quantity: 1, reason: "Substitui a vedação gasta" },
            { productId: "hid-veda-rosca", quantity: 1, reason: "Evita vazamento na rosca" },
            { productId: "fer-chave-fenda", quantity: 1, reason: "Solta o volante da torneira" },
            {
              productId: "lim-pano-multiuso",
              quantity: 1,
              optional: true,
              reason: "Limpeza e proteção do ralo durante a troca",
            },
          ],
          storeId
        ),
        tutorial: TUTORIALS["reparo-torneira"],
        createdAt: Date.now(),
      };

    case "reparo-monocomando":
      return {
        id: "reparo-monocomando",
        title: "Reparo de torneira monocomando",
        subtitle: "Cartucho cerâmico 35mm + vedação",
        description:
          "Solução para torneiras de uma alavanca que continuam pingando mesmo fechadas. Inclui cartucho cerâmico, veda-rosca e ferramenta básica.",
        storeId,
        difficulty: "Moderado",
        estimatedInstallMin: 20,
        sourceIntent: "torneira",
        items: materializeProjectItems(
          [
            { productId: "hid-cartucho-mono", quantity: 1, reason: "Vedação interna do misturador" },
            { productId: "hid-veda-rosca", quantity: 1, reason: "Vedação segura das roscas" },
            { productId: "fer-chave-inglesa", quantity: 1, reason: "Solta a porca do cartucho" },
            { productId: "lim-pano-multiuso", quantity: 1, optional: true },
          ],
          storeId
        ),
        tutorial: TUTORIALS["reparo-torneira"],
        createdAt: Date.now(),
      };

    case "troca-torneira":
      return {
        id: "troca-torneira",
        title: "Troca completa da torneira",
        subtitle: "Torneira monocomando nova + acessórios de instalação",
        description:
          "Solução definitiva e moderna para torneiras antigas ou oxidadas, com tudo o que você precisa para instalar em menos de 20 minutos.",
        storeId,
        difficulty: "Fácil",
        estimatedInstallMin: 20,
        sourceIntent: "torneira",
        items: materializeProjectItems(
          [
            { productId: "hid-torneira-mono", quantity: 1, reason: "Torneira nova 1/4 de volta" },
            { productId: "hid-engate-flex", quantity: 1, reason: "Conexão segura à parede" },
            { productId: "hid-veda-rosca", quantity: 1, reason: "Veda as roscas sem gotejar" },
            { productId: "fer-chave-inglesa", quantity: 1, reason: "Aperto das porcas inferiores" },
          ],
          storeId
        ),
        tutorial: TUTORIALS["troca-torneira"],
        createdAt: Date.now(),
      };

    case "troca-sifao":
      return {
        id: "troca-sifao",
        title: "Troca do sifão embaixo da pia",
        subtitle: "Fim do vazamento inferior e do mau cheiro",
        description:
          "Kit prático para substituir o sifão ressecado ou furado debaixo da pia/lavatório usando encaixe universal sem precisar de ferramentas pesadas.",
        storeId,
        difficulty: "Fácil",
        estimatedInstallMin: 12,
        sourceIntent: "torneira",
        items: materializeProjectItems(
          [
            { productId: "hid-sifao-univ", quantity: 1, reason: "Compatível com qualquer pia" },
            { productId: "hid-veda-rosca", quantity: 1, reason: "Reforço extra na rosca" },
            { productId: "hid-silicone-antimofo", quantity: 1, optional: true, reason: "Veda frestas da cuba" },
            { productId: "lim-pano-multiuso", quantity: 1, optional: true },
          ],
          storeId
        ),
        tutorial: TUTORIALS["troca-sifao"],
        createdAt: Date.now(),
      };

    case "pintura-quarto":
      return buildPaintingProject({
        storeId,
        widthM: 3,
        lengthM: 4,
        includeCeiling: false,
        color: "azul",
        finish: "fosco",
      });

    case "reparo-trinca":
      return {
        id: "reparo-trinca",
        title: "Reparo de trinca superficial e umidade",
        subtitle: "Tratamento completo contra fissuras e retorno de mofo",
        description:
          "Kit para tratar trincas superficiais (< 30cm) em banheiros ou quartos usando fita telada + massa acrílica antimofo para evitar que a rachadura volte.",
        storeId,
        difficulty: "Moderado",
        estimatedInstallMin: 55,
        sourceIntent: "trinca",
        items: materializeProjectItems(
          [
            { productId: "mat-massa-acrilica", quantity: 1, reason: "Resistente à umidade do banheiro" },
            { productId: "mat-fita-telada", quantity: 1, reason: "Impede a trinca de reabrir" },
            { productId: "mat-espatula-aco", quantity: 1, reason: "Raspagem e aplicação lisa" },
            { productId: "tin-lixa-120", quantity: 1, reason: "Acabamento nivelado" },
            { productId: "lim-removedor-mofo", quantity: 1, reason: "Higieniza fungos antes da massa" },
            {
              productId: "mat-impermeabilizante",
              quantity: 1,
              optional: true,
              reason: "Recomendado se houver manchas de umidade",
            },
          ],
          storeId
        ),
        tutorial: TUTORIALS["reparo-trinca"],
        createdAt: Date.now(),
      };

    case "instalar-prateleira":
    case "instalar-prateleira-drywall": {
      const isDrywall = id === "instalar-prateleira-drywall";
      return {
        id,
        title: isDrywall
          ? "Instalação de prateleira em Drywall"
          : "Instalação de prateleira em Alvenaria",
        subtitle: isDrywall
          ? "Buchas borboleta para gesso + suportes reforçados"
          : "Buchas S8 + brocas vídea + nivelamento preciso",
        description: isDrywall
          ? "Kit seguro para paredes ocas de gesso acartonado (drywall), com buchas especiais de expansão que evitam que o parafuso solte."
          : "Tudo o que você precisa para fixar sua prateleira reta e firme em parede de tijolo ou concreto, até 40kg.",
        storeId,
        difficulty: "Moderado",
        estimatedInstallMin: 25,
        sourceIntent: "prateleira",
        items: materializeProjectItems(
          [
            { productId: "fix-prateleira-mdf", quantity: 1, reason: "Prateleira branca 80×25cm" },
            { productId: "fix-mao-francesa", quantity: 1, reason: "Suporte reforçado até 40kg" },
            {
              productId: isDrywall ? "fix-bucha-drywall" : "fix-bucha-s8",
              quantity: 1,
              reason: isDrywall ? "Própria para gesso/drywall" : "Fixação firme em alvenaria",
            },
            { productId: "fer-kit-brocas", quantity: 1, reason: "Brocas 6, 8 e 10mm" },
            { productId: "fer-nivel-bolha", quantity: 1, reason: "Garante alinhamento reto" },
            {
              productId: "fer-furadeira",
              quantity: 1,
              optional: true,
              reason: "Opcional caso você ainda não tenha furadeira em casa",
            },
          ],
          storeId
        ),
        tutorial: TUTORIALS["instalar-prateleira"],
        createdAt: Date.now(),
      };
    }

    case "troca-resistencia":
      return {
        id: "troca-resistencia",
        title: "Troca de resistência do chuveiro",
        subtitle: "Reparo elétrico seguro com conector Wago",
        description:
          "Volte a ter água quente em 20 minutos com segurança reforçada: inclui resistência blindada, conector Wago 32A (evita emenda derretida) e chave teste.",
        storeId,
        difficulty: "Moderado",
        estimatedInstallMin: 20,
        sourceIntent: "eletrica",
        items: materializeProjectItems(
          [
            { productId: "ele-resistencia-univ", quantity: 1, reason: "Reposição para água quente" },
            { productId: "ele-conector-wago", quantity: 1, reason: "Conexão segura que não derrete" },
            { productId: "ele-chave-teste", quantity: 1, reason: "Confirma energia desligada" },
            {
              productId: "ele-chuveiro-eletronico",
              quantity: 1,
              optional: true,
              reason: "Opcional se preferir trocar por um chuveiro novo",
            },
          ],
          storeId
        ),
        tutorial: TUTORIALS["troca-resistencia"],
        createdAt: Date.now(),
      };

    case "trocar-iluminacao":
      return {
        id: "trocar-iluminacao",
        title: "Upgrade de iluminação LED",
        subtitle: "Mais claridade com até 85% de economia",
        description:
          "Kit prático para substituir luminária antiga por painel LED moderno de luz neutra + itens de segurança elétrica.",
        storeId,
        difficulty: "Fácil",
        estimatedInstallMin: 18,
        sourceIntent: "iluminacao",
        items: materializeProjectItems(
          [
            { productId: "ele-painel-led-18w", quantity: 1, reason: "Luz neutra uniforme 4000K" },
            { productId: "ele-fita-isolante", quantity: 1, reason: "Isolamento antichama" },
            { productId: "ele-chave-teste", quantity: 1, reason: "Confirma circuito desligado" },
            {
              productId: "ele-lampada-led-9w",
              quantity: 1,
              optional: true,
              reason: "Luz quente extra para abajur ou ponto auxiliar",
            },
          ],
          storeId
        ),
        tutorial: TUTORIALS["trocar-iluminacao"],
        createdAt: Date.now(),
      };

    default:
      return null;
  }
}

export const ALL_PRESET_IDS = [
  "reparo-torneira",
  "reparo-monocomando",
  "troca-torneira",
  "troca-sifao",
  "pintura-quarto",
  "reparo-trinca",
  "instalar-prateleira",
  "instalar-prateleira-drywall",
  "troca-resistencia",
  "trocar-iluminacao",
];

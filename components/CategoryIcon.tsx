import {
  DropletIcon,
  LayersIcon,
  PackageIcon,
  PaintbrushIcon,
  SparkleIcon,
  WrenchIcon,
  ZapIcon,
} from "./Icons";

type IconComp = React.ComponentType<{
  size?: number;
  className?: string;
  strokeWidth?: number;
}>;

const CATEGORY_MAP: Record<string, IconComp> = {
  Hidráulica: DropletIcon,
  Tintas: PaintbrushIcon,
  Ferramentas: WrenchIcon,
  Fixação: LayersIcon,
  Elétrica: ZapIcon,
  "Materiais Básicos": PackageIcon,
  Limpeza: SparkleIcon,
};

export function CategoryIcon({
  category,
  size = 38,
}: {
  category: string;
  size?: number;
}) {
  const Icon = CATEGORY_MAP[category] ?? PackageIcon;

  return (
    <div
      className="flex flex-shrink-0 items-center justify-center rounded-lg border border-rule bg-floor text-signage"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <Icon size={Math.round(size * 0.48)} strokeWidth={1.6} />
    </div>
  );
}

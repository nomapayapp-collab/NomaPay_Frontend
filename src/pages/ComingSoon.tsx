import { Logo } from "../components/ui/Logo";
import { BottomTabBar } from "../components/layout/BottomTabBar";

type ComingSoonProps = {
  title: string;
};

export default function ComingSoon({ title }: ComingSoonProps) {
  return (
    <div className="min-h-screen flex flex-col bg-surface-dark">
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center max-w-md w-full mx-auto">
        <Logo variant="icono" className="w-12 h-12 opacity-60" />
        <div>
          <h1 className="title mb-1">{title}</h1>
          <p className="subtitle">Estamos trabajando en esta sección — volvé pronto.</p>
        </div>
      </div>

      <BottomTabBar />
    </div>
  );
}
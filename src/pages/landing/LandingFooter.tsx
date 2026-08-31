import { Logo } from "../../components/ui/Logo";

/* const FOOTER_LINKS = {
  Producto: [
    { label: "¿Cómo funciona?", href: "#como-funciona" },
    { label: "Para quién es", href: "#para-quien-es" },
    { label: "Seguridad", href: "#seguridad" },
    { label: "Comisiones", href: "#" },
  ],
  Compañía: [
    { label: "Nosotros", href: "#" },
    { label: "Contacto", href: "#" },
  ],
  Legal: [
    { label: "Términos y condiciones", href: "#" },
    { label: "Política de privacidad", href: "#" },
  ],
}; */

export function LandingFooter() {
  return (
    <footer id="contacto" className="bg-surface-dark px-6 md:px-12 py-12 flex row justify-between align-middle w-full">
      <Logo variant="lockup-oscuro" className="h-12 w-auto mb-2" />
      <p className="text-md text-text-dark-tertiary">Cobrá global. Viví local.</p>
      <p className="text-md">
        Contacto: nomapayapp@gmail.com
      </p>
      {/*    <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
        {Object.entries(FOOTER_LINKS).map(([section, links]) => (
          <div key={section}>
            <p className="text-xs tracking-[0.14em] uppercase text-text-dark-tertiary font-semibold mb-3">
              {section}
            </p>
            <ul className="flex flex-col gap-2">
              {links.map((l) => (
                <li key={l.label} >
                <a
                    href={l.href}
                    className="text-sm text-text-dark-secondary hover:text-text-dark-primary transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div> */}
    </footer>
  );
}
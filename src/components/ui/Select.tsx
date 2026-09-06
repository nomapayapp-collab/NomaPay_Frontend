import { useEffect, useRef, useState } from "react";
import { IconCheck, IconChevronRight } from "../../assets/icons/Icons";

/**
 * Dropdown propio para reemplazar el <select> nativo en los casos
 * en los que necesitamos controlar dónde y cómo se abren las opciones 
 * Uso:
 *   <Select
 *     label="País de residencia"
 *     value={country}
 *     onChange={setCountry}
 *     options={COUNTRIES.map((c) => ({ value: c.code, label: c.name }))}
 *   />
 */
type SelectOption = { value: string; label: string };

type SelectProps = {
  label?: string;
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
};

export function Select({ label, id, value, onChange, options, placeholder, className }: SelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label className="input__label" htmlFor={id}>
          {label}
        </label>
      )}

      <button
        type="button"
        id={id}
        onClick={() => setOpen((v) => !v)}
        className={["input flex items-center justify-between text-left", className].filter(Boolean).join(" ")}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={selected ? "" : "text-text-light-tertiary dark:text-text-dark-tertiary"}>
          {selected?.label ?? placeholder ?? "Seleccioná una opción"}
        </span>
        <IconChevronRight
          className={`w-4 h-4 rotate-90 text-text-light-tertiary dark:text-text-dark-tertiary transition-transform shrink-0 ${
            open ? "-scale-y-100" : ""
          }`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 top-full mt-2 z-20 max-h-56 overflow-y-auto rounded-control border border-border-light dark:border-border-dark bg-surface-light-input dark:bg-surface-dark-elevated shadow-elevation-lg py-1.5"
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <li key={option.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={[
                    "w-full flex items-center justify-between px-4 py-2.5 text-[14px] text-left transition-colors",
                    isSelected
                      ? "text-violet-500 bg-violet-500/10 font-semibold"
                      : "text-text-light-primary dark:text-text-dark-primary hover:bg-black/5 dark:hover:bg-white/8",
                  ].join(" ")}
                >
                  {option.label}
                  {isSelected && <IconCheck className="w-4 h-4" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
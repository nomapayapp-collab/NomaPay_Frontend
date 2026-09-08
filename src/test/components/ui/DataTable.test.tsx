import { useState } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DataTable, type DataTableColumn } from "../../../components/ui/DataTable";

type Item = { id: number; name: string; category: string };

const ITEMS: Item[] = [
  { id: 1, name: "Uno", category: "A" },
  { id: 2, name: "Dos", category: "B" },
];

const COLUMNS: DataTableColumn<Item>[] = [
  { key: "name", header: "Nombre", width: "1fr", render: (item) => item.name },
  { key: "category", header: "Categoría", width: "100px", hideOnMobile: true, render: (item) => item.category },
];

/**
 * Suite aislada del componente genérico (no depende de Historial): esto es
 * lo que da confianza para reusarlo tal cual en el panel de administrador
 * más adelante, con otras columnas.
 */
describe("DataTable", () => {
  it("muestra el esqueleto mientras loading, respetando skeletonRows", () => {
    const { container } = render(<DataTable items={[]} columns={COLUMNS} getRowKey={(i) => i.id} loading />);
    expect(container.querySelectorAll(".animate-pulse")).toHaveLength(4); // default

    const { container: container2 } = render(
      <DataTable items={[]} columns={COLUMNS} getRowKey={(i) => i.id} loading skeletonRows={2} />,
    );
    expect(container2.querySelectorAll(".animate-pulse")).toHaveLength(2);
  });

  it("muestra el error en vez de la tabla", () => {
    render(<DataTable items={ITEMS} columns={COLUMNS} getRowKey={(i) => i.id} error="Algo salió mal" />);

    expect(screen.getByText("Algo salió mal")).toBeInTheDocument();
    expect(screen.queryByText("Nombre")).not.toBeInTheDocument();
    expect(screen.queryByText("Uno")).not.toBeInTheDocument();
  });

  it("muestra el emptyState cuando no hay items", () => {
    render(<DataTable items={[]} columns={COLUMNS} getRowKey={(i) => i.id} emptyState={<p>Nada por acá</p>} />);

    expect(screen.getByText("Nada por acá")).toBeInTheDocument();
  });

  it("renderiza cada item en desktop y mobile con columns[].render", () => {
    render(<DataTable items={ITEMS} columns={COLUMNS} getRowKey={(i) => i.id} />);

    // aparece 2 veces: una en la grilla desktop y otra en la card mobile
    expect(screen.getAllByText("Uno")).toHaveLength(2);
    expect(screen.getAllByText("Dos")).toHaveLength(2);
  });

  it("una columna con hideOnMobile no aparece en la card compacta de mobile", () => {
    render(<DataTable items={ITEMS} columns={COLUMNS} getRowKey={(i) => i.id} />);

    // "A"/"B" (categoría) solo deberían estar en el desktop, no duplicados en mobile
    expect(screen.getAllByText("A")).toHaveLength(1);
    expect(screen.getAllByText("B")).toHaveLength(1);
  });

  it("sin renderDetail/onToggleExpand las filas no son clickeables", () => {
    render(<DataTable items={ITEMS} columns={COLUMNS} getRowKey={(i) => i.id} />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("con renderDetail y onToggleExpand, clickear una fila despliega el detalle ahí mismo (acordeón, no modal)", async () => {
    const user = userEvent.setup();
    const onToggleExpand = vi.fn();

    function Wrapper() {
      const [expandedKey, setExpandedKey] = useState<string | number | null>(null);
      return (
        <DataTable
          items={ITEMS}
          columns={COLUMNS}
          getRowKey={(item) => item.id}
          renderDetail={(item) => <p>Detalle de {item.name}</p>}
          expandedKey={expandedKey}
          onToggleExpand={(key) => {
            onToggleExpand(key);
            setExpandedKey((current) => (current === key ? null : key));
          }}
        />
      );
    }

    render(<Wrapper />);

    const row = screen.getAllByText("Uno")[0].closest("button")!;
    expect(row).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Detalle de Uno")).not.toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(row);

    expect(onToggleExpand).toHaveBeenCalledWith(1);
    expect(row).toHaveAttribute("aria-expanded", "true");
    expect(screen.getAllByText("Detalle de Uno").length).toBeGreaterThan(0);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument(); // sigue sin haber modal

    await user.click(row);

    expect(row).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Detalle de Uno")).not.toBeInTheDocument();
  });

  it("agrupa las cards de mobile con groupBy, sin afectar la grilla de desktop", () => {
    const { container } = render(
      <DataTable
        items={ITEMS}
        columns={COLUMNS}
        getRowKey={(item) => item.id}
        groupBy={(item) => ({ key: item.category, label: `Grupo ${item.category}` })}
      />,
    );

    expect(screen.getByText("Grupo A")).toBeInTheDocument();
    expect(screen.getByText("Grupo B")).toBeInTheDocument();

    const desktopBlock = container.querySelector(".hidden.lg\\:block") as HTMLElement;
    expect(within(desktopBlock).queryByText("Grupo A")).not.toBeInTheDocument();
  });
});

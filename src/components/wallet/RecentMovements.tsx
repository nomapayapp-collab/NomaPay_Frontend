import { Card } from "../../components/ui/Card";
import { formatCurrency } from "../../utils/formatCurrency";
import { useWallet } from "../../hooks/useWallet";

/**
 * "Movimientos recientes", preview acá.
 */
export function RecentMovements() {
  const { wallet } = useWallet();

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <p className="card__title">Movimientos recientes</p>
        <button type="button" className="text-[12.5px] font-medium text-violet-300 hover:text-violet-500">         
           Ver todos
        </button>
      </div>

      <ul className="divide-y divide-border-dark">
        {wallet.recentMovements.map(({ id, description, amount, currency }) => (
          <li key={id} className="flex items-center justify-between py-3 text-[14px]">
            <span className="text-text-dark-primary">{description}</span>
            <span className={`tabular font-medium ${amount < 0 ? "text-text-dark-secondary" : "text-turquoise-500"}`}>
              {amount < 0 ? "-" : "+"}
              {formatCurrency(Math.abs(amount), currency)}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
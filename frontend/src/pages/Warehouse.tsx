import { useEffect, useState } from 'react'
import { api, Stock, Warehouse } from '../api/client'
import Page, { TableWrap } from '../components/Page'
import { useI18n } from '../i18n/I18nContext'

export default function WarehousePage() {
  const { t } = useI18n()
  const [stocks, setStocks] = useState<Stock[]>([])
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [filter, setFilter] = useState<number>(0)

  const load = () => {
    api.stocks.list(filter ? { warehouse_id: filter } : undefined).then(setStocks).catch(console.error)
    api.warehouses.list().then(setWarehouses).catch(console.error)
  }
  useEffect(() => { load() }, [filter])

  return (
    <Page
      title={t.warehouse.title}
      action={
        <select
          className="input w-full sm:w-auto max-w-full"
          value={filter}
          onChange={(e) => setFilter(+e.target.value)}
        >
          <option value={0}>{t.common.allWarehouses}</option>
          {warehouses.map((w) => (
            <option key={w.id} value={w.id}>{w.name}</option>
          ))}
        </select>
      }
    >
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {warehouses.map((w) => (
          <div key={w.id} className="card p-5">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h3 className="font-semibold">{w.name}</h3>
              {w.is_default && (
                <span className="text-xs bg-kinetix-100 text-kinetix-700 dark:bg-kinetix-900/60 dark:text-kinetix-300 px-2 py-0.5 rounded-full">{t.common.main}</span>
              )}
            </div>
            {w.address && <div className="text-sm text-app-text-muted">{w.address}</div>}
            <div className="text-sm text-app-text-muted mt-2">
              {t.common.positions}: {stocks.filter((s) => s.warehouse_id === w.id).length}
            </div>
          </div>
        ))}
      </div>

      <div className="md:hidden space-y-3">
        {stocks.length === 0 ? (
          <div className="card p-6 text-center text-app-text-muted">{t.common.noStocks}</div>
        ) : (
          stocks.map((s) => (
            <div key={s.id} className="card p-4">
              <h3 className="font-semibold">{s.product_name}</h3>
              <p className="text-sm text-app-text-muted mt-1">{s.warehouse_name}</p>
              <div className="grid grid-cols-3 gap-2 mt-3 text-sm text-center">
                <div>
                  <div className="text-app-text-muted text-xs">{t.common.quantity}</div>
                  <div className="font-medium">{s.quantity}</div>
                </div>
                <div>
                  <div className="text-app-text-muted text-xs">{t.common.reserved}</div>
                  <div className="font-medium text-orange-500 dark:text-orange-400">{s.reserved}</div>
                </div>
                <div>
                  <div className="text-app-text-muted text-xs">{t.common.available}</div>
                  <div className={s.available > 0 ? 'font-medium text-green-600 dark:text-green-400' : 'font-medium text-red-500 dark:text-red-400'}>
                    {s.available}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="hidden md:block">
        <TableWrap>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left p-4 font-medium">{t.common.product}</th>
                <th className="text-left p-4 font-medium">{t.common.warehouse}</th>
                <th className="text-right p-4 font-medium">{t.common.quantity}</th>
                <th className="text-right p-4 font-medium">{t.common.reserved}</th>
                <th className="text-right p-4 font-medium">{t.common.available}</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((s) => (
                <tr key={s.id}>
                  <td className="p-4 font-medium">{s.product_name}</td>
                  <td className="p-4">{s.warehouse_name}</td>
                  <td className="p-4 text-right font-medium">{s.quantity}</td>
                  <td className="p-4 text-right text-orange-500 dark:text-orange-400">{s.reserved}</td>
                  <td className="p-4 text-right">
                    <span className={s.available > 0 ? 'text-green-600 dark:text-green-400 font-medium' : 'text-red-500 dark:text-red-400'}>
                      {s.available}
                    </span>
                  </td>
                </tr>
              ))}
              {stocks.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-app-text-muted">{t.common.noStocks}</td>
                </tr>
              )}
            </tbody>
          </table>
        </TableWrap>
      </div>
    </Page>
  )
}

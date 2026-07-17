import { Monitor, Server, Wifi, Smartphone, Plus, Filter } from 'lucide-react'
import type { Asset, AssetType } from '@/types'
import { ASSETS } from '@/data/mockData'
import {
  ASSET_STATUS_LABEL,
  ASSET_STATUS_CLASS,
  ASSET_TYPE_LABEL,
  ASSET_TYPE_ICON_CLASS,
  getHealthColor,
  getHealthTextColor,
} from '@/utils/helpers'

const ASSET_ICONS: Record<AssetType, React.ElementType> = {
  workstation: Monitor,
  server: Server,
  network: Wifi,
  mobile: Smartphone,
}

export function AssetsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        <button className="btn">
          <Filter size={13} />
          Filtrar
        </button>
        <button className="btn btn-primary">
          <Plus size={14} />
          Cadastrar ativo
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {ASSETS.map((asset) => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </div>
    </div>
  )
}

function AssetCard({ asset }: { asset: Asset }) {
  const Icon = ASSET_ICONS[asset.type]

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${ASSET_TYPE_ICON_CLASS[asset.type]}`}>
          <Icon size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900">{asset.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">{ASSET_TYPE_LABEL[asset.type]}</p>
        </div>
        <span className={`badge ${ASSET_STATUS_CLASS[asset.status]}`}>
          {ASSET_STATUS_LABEL[asset.status]}
        </span>
      </div>

      <div className="border-t border-gray-100 pt-3 mb-3 space-y-2">
        {Object.entries(asset.specs).map(([key, value]) => (
          <div key={key} className="flex justify-between text-xs">
            <span className="text-gray-400">{key}</span>
            <span className="font-medium text-gray-900">{value}</span>
          </div>
        ))}
      </div>

      <HealthBar percent={asset.healthPercent} />
    </div>
  )
}

function HealthBar({ percent }: { percent: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-xs text-gray-400 flex-shrink-0">Saúde</span>
      <div className="health-bar">
        <div
          className={`h-full rounded-full ${getHealthColor(percent)}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className={`text-xs font-semibold w-8 text-right ${getHealthTextColor(percent)}`}>
        {percent}%
      </span>
    </div>
  )
}

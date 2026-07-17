import { useApp } from '@/context/AppContext'

export function ToastContainer() {
  const { toasts } = useApp()

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-gray-900 text-white text-sm font-medium px-4 py-2.5 rounded-lg
                     animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}

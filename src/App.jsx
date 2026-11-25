import DrawTab from './components/DrawTab.jsx'

export default function App() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center gap-3">
          <img src="/favicon.svg?v=2" alt="" className="h-10 w-10" />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Pixels <span className="text-slate-400">·</span>{' '}
            <span className="font-medium text-slate-600">How a computer sees an image</span>
          </h1>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <DrawTab />
      </main>
    </div>
  )
}

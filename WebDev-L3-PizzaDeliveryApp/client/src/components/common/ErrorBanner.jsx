export default function ErrorBanner({ message }) { return message ? <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{message}</div> : null; }

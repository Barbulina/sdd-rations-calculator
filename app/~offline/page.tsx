export default function OfflinePage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <svg
        className="mb-6 h-16 w-16 text-gray-400 dark:text-gray-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M18.364 5.636a9 9 0 0 1 0 12.728m-2.829-2.829a5 5 0 0 0 0-7.07m-4.243 4.243a1 1 0 0 1 0-1.414.999.999 0 0 1 1.414 0M3 3l18 18"
        />
      </svg>
      <h1 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-100">
        Sin conexión
      </h1>
      <p className="max-w-xs text-sm text-gray-500 dark:text-gray-400">
        No tienes conexión a internet. Los datos guardados localmente siguen
        disponibles.
      </p>
    </div>
  );
}

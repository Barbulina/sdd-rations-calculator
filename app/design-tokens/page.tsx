export default function DesignTokensPage() {
  const categoryColors = [
    { name: 'category-lacteal', light: '#6750A4', dark: '#D0BCFF', role: 'Primary', category: 'Lacteal' },
    { name: 'category-cereals-flours-pulses-legumes-tubers', light: '#625B71', dark: '#CCC2DC', role: 'Secondary', category: 'Cereals/Flours/Pulses/Legumes/Tubers' },
    { name: 'category-fruits', light: '#7D5260', dark: '#EFB8C8', role: 'Tertiary', category: 'Fruits' },
    { name: 'category-vegetables', light: '#386A20', dark: '#A8D88A', role: 'Custom Extended 1', category: 'Vegetables' },
    { name: 'category-oily-dry-fruits', light: '#6C5D3D', dark: '#D4C4A0', role: 'Custom Extended 2', category: 'Oily/Dry Fruits' },
    { name: 'category-drinks', light: '#0061A4', dark: '#9ECAFF', role: 'Custom Extended 3', category: 'Drinks' },
    { name: 'category-others', light: '#49454F', dark: '#CAC4D0', role: 'Surface Variant', category: 'Others' },
  ];

  const stateColors = [
    { name: 'state-offline', light: '#BF360C', dark: '#FFD54F', label: 'Offline' },
    { name: 'state-syncing', light: '#01579B', dark: '#64B5F6', label: 'Syncing' },
    { name: 'state-sync-error', light: '#D32F2F', dark: '#E57373', label: 'Sync Error' },
    { name: 'state-online', light: '#1B5E20', dark: '#81C784', label: 'Online' },
  ];

  const feedbackColors = [
    { name: 'feedback-success', light: '#2E7D32', dark: '#66BB6A', label: 'Success' },
    { name: 'feedback-warning', light: '#BF360C', dark: '#FFB74D', label: 'Warning' },
    { name: 'feedback-error', light: '#C62828', dark: '#EF5350', label: 'Error' },
    { name: 'feedback-info', light: '#0277BD', dark: '#4FC3F7', label: 'Info' },
  ];

  return (
    <main className="min-h-screen p-8 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Design Token Specimen</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          All design tokens for the Rations Calculator PWA
        </p>

        {/* Category Colors */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Category Colors (User Story 1)</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Seven aliment categories mapped to Material Design 3 color roles
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryColors.map((color) => (
              <div key={color.name} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="font-semibold mb-2">{color.category}</h3>
                <div className="flex gap-2 mb-2">
                  <div 
                    className="w-16 h-16 rounded border border-gray-300"
                    style={{ backgroundColor: color.light }}
                  />
                  <div 
                    className="w-16 h-16 rounded border border-gray-300"
                    style={{ backgroundColor: color.dark }}
                  />
                </div>
                <div className="text-xs space-y-1">
                  <p className="font-mono">Light: {color.light}</p>
                  <p className="font-mono">Dark: {color.dark}</p>
                  <p className="text-gray-600 dark:text-gray-400">M3 Role: {color.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* State Colors */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">State Indicators (User Story 2)</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Offline/online status and synchronization state colors
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stateColors.map((color) => (
              <div key={color.name} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="font-semibold mb-2">{color.label}</h3>
                <div className="flex gap-2 mb-2">
                  <div 
                    className="w-12 h-12 rounded border border-gray-300"
                    style={{ backgroundColor: color.light }}
                  />
                  <div 
                    className="w-12 h-12 rounded border border-gray-300"
                    style={{ backgroundColor: color.dark }}
                  />
                </div>
                <div className="text-xs space-y-1">
                  <p className="font-mono">{color.light}</p>
                  <p className="font-mono">{color.dark}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Feedback Colors */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Feedback States (User Story 4)</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Action feedback and validation state colors
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {feedbackColors.map((color) => (
              <div key={color.name} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="font-semibold mb-2">{color.label}</h3>
                <div className="flex gap-2 mb-2">
                  <div 
                    className="w-12 h-12 rounded border border-gray-300"
                    style={{ backgroundColor: color.light }}
                  />
                  <div 
                    className="w-12 h-12 rounded border border-gray-300"
                    style={{ backgroundColor: color.dark }}
                  />
                </div>
                <div className="text-xs space-y-1">
                  <p className="font-mono">{color.light}</p>
                  <p className="font-mono">{color.dark}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Typography Scale */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Typography Scale (User Story 3)</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Material Design 3 type scale - headings, body, and labels
          </p>
          <div className="space-y-4">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <p style={{ fontSize: '57px', lineHeight: '64px', letterSpacing: '-0.25px' }}>
                Heading 1 - Display Large (57px)
              </p>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <p style={{ fontSize: '45px', lineHeight: '52px' }}>
                Heading 2 - Display Medium (45px)
              </p>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <p style={{ fontSize: '36px', lineHeight: '44px' }}>
                Heading 3 - Display Small (36px)
              </p>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <p style={{ fontSize: '16px', lineHeight: '24px', letterSpacing: '0.5px' }}>
                Body Large (16px) - Default body text for comfortable reading
              </p>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <p style={{ fontSize: '14px', lineHeight: '20px', letterSpacing: '0.25px' }}>
                Body Medium (14px) - Compact body text for lists and cards
              </p>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <p style={{ fontSize: '14px', lineHeight: '20px', letterSpacing: '0.1px', fontWeight: 500 }}>
                Label Large (14px) - Button and form labels
              </p>
            </div>
          </div>
        </section>

        {/* Spacing Scale */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Spacing Scale (User Story 3)</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            8px grid system for consistent spacing
          </p>
          <div className="space-y-2">
            {[0, 1, 2, 3, 4, 5, 6, 8, 10, 12].map((factor) => {
              const pixels = factor * 8;
              return (
                <div key={factor} className="flex items-center gap-4">
                  <div className="w-24 text-sm font-mono">space-{factor}</div>
                  <div className="w-16 text-sm text-gray-600 dark:text-gray-400">{pixels}px</div>
                  <div 
                    className="h-8 bg-blue-500"
                    style={{ width: `${pixels}px` }}
                  />
                  {pixels >= 44 && (
                    <span className="text-xs text-green-600 dark:text-green-400">
                      ✓ Touch target compliant
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Build Instructions */}
        <section className="mt-12 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Next Steps</h2>
          <p className="text-sm mb-4">
            To use these tokens in your components, run the build script:
          </p>
          <code className="block p-4 bg-gray-900 text-green-400 rounded font-mono text-sm">
            npm run tokens:build
          </code>
          <p className="text-sm mt-4 text-gray-600 dark:text-gray-400">
            This will generate Tailwind utility classes like <code className="px-1 bg-gray-200 dark:bg-gray-700 rounded">bg-category-lacteal</code>, <code className="px-1 bg-gray-200 dark:bg-gray-700 rounded">text-state-offline</code>, etc.
          </p>
        </section>
      </div>
    </main>
  );
}

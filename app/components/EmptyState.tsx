import Link from "next/link";

/**
 * EmptyState Component
 *
 * Displayed when no rations exist in the list.
 * Provides a call-to-action button to create the first ration.
 *
 * @see ../../../specs/002-ration-menu-management/spec.md for user story
 */
export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="text-6xl mb-4">📋</div>
      <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-200">
        No rations yet
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
        Start building your ration database by creating your first entry.
      </p>
      <Link
        href="/create-ration"
        className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition font-medium"
      >
        Create First Ration
      </Link>
    </div>
  );
}

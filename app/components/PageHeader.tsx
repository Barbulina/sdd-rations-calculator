import Link from "next/link";
import { NavMenu } from "./NavMenu";

interface PageHeaderProps {
  title: string;
  backHref?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, backHref, action }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 max-w-4xl mx-auto px-4 py-4">
        {backHref && (
          <Link
            href={backHref}
            aria-label="Go back"
            className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 shrink-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12.79 5.23a.75.75 0 0 1 0 1.06L8.832 10l3.958 3.71a.75.75 0 1 1-1.04 1.08l-4.5-4.25a.75.75 0 0 1 0-1.08l4.5-4.25a.75.75 0 0 1 1.04 0Z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        )}

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex-1">
          {title}
        </h1>

        {action && <div className="shrink-0">{action}</div>}

        <NavMenu />
      </div>
    </header>
  );
}

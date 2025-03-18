import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PageHeaderProps {
  title: string
  subtitle?: string
  backLink?: {
    href: string
    label: string
  }
}

export function PageHeader({ title, subtitle, backLink }: PageHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-gray-600 sm:text-base">{subtitle}</p>}
          </div>
          {backLink && (
            <div className="flex gap-2">
              <Link href={backLink.href}>
                <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                  <ArrowLeft className="w-3 h-3 mr-1 sm:w-4 sm:h-4 sm:mr-2" />
                  {backLink.label}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}


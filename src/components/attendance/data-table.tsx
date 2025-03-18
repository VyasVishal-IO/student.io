"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DataTableProps {
  headers: string[]
  data: any[]
  searchQuery: string
  onSearch: (query: string) => void
  rowsPerPage: number
  setRowsPerPage: (value: number) => void
  selectedSheet?: string
  availableSheets?: string[]
  onSheetChange?: (sheet: string) => void
}

export function DataTable({
  headers,
  data,
  searchQuery,
  onSearch,
  rowsPerPage,
  setRowsPerPage,
  selectedSheet,
  availableSheets,
  onSheetChange,
}: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalRows = data.length
  const totalPages = Math.ceil(totalRows / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = Math.min(startIndex + rowsPerPage, totalRows)
  const currentData = data.slice(startIndex, endIndex)

  const paginationButtons = () => {
    const buttons = []
    const maxButtons = 5

    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2))
    const endPage = Math.min(totalPages, startPage + maxButtons - 1)

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1)
    }

    // First page
    buttons.push(
      <Button key="first" variant="outline" size="sm" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
        First
      </Button>,
    )

    // Previous page
    buttons.push(
      <Button
        key="prev"
        variant="outline"
        size="sm"
        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
        disabled={currentPage === 1}
      >
        &lt;
      </Button>,
    )

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button key={i} variant={currentPage === i ? "default" : "outline"} size="sm" onClick={() => setCurrentPage(i)}>
          {i}
        </Button>,
      )
    }

    // Next page
    buttons.push(
      <Button
        key="next"
        variant="outline"
        size="sm"
        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
        disabled={currentPage === totalPages}
      >
        &gt;
      </Button>,
    )

    // Last page
    buttons.push(
      <Button
        key="last"
        variant="outline"
        size="sm"
        onClick={() => setCurrentPage(totalPages)}
        disabled={currentPage === totalPages}
      >
        Last
      </Button>,
    )

    return buttons
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          {availableSheets && availableSheets.length > 0 && onSheetChange && (
            <Select value={selectedSheet} onValueChange={onSheetChange}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Select Sheet" />
              </SelectTrigger>
              <SelectContent>
                {availableSheets.map((sheet) => (
                  <SelectItem key={sheet} value={sheet}>
                    {sheet}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <div className="relative w-full sm:w-64">
            <Input
              type="text"
              placeholder="Search..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <Select
          value={rowsPerPage.toString()}
          onValueChange={(value) => {
            setRowsPerPage(Number(value))
            setCurrentPage(1)
          }}
        >
          <SelectTrigger className="w-full sm:w-32">
            <SelectValue placeholder="Rows per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="25">25 rows</SelectItem>
            <SelectItem value="50">50 rows</SelectItem>
            <SelectItem value="100">100 rows</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header, index) => (
                  <TableHead key={index} className="bg-gray-50 font-semibold whitespace-nowrap">
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell: any, cellIndex: number) => (
                    <TableCell key={cellIndex} className="whitespace-nowrap">
                      {cell !== null ? String(cell) : ""}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="text-sm text-gray-600 order-2 sm:order-1">
          Showing {startIndex + 1} - {endIndex} of {totalRows} rows
        </div>
        <div className="flex flex-wrap justify-center gap-1 order-1 sm:order-2">{paginationButtons()}</div>
      </div>
    </div>
  )
}


"use client"

import type React from "react"
import { Upload, FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface FileUploadProps {
  onFileUpload: (file: File) => Promise<void>
  uploadLoading: boolean
  progress: number
  fileName: string
}

export function FileUpload({ onFileUpload, uploadLoading, progress, fileName }: FileUploadProps) {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    await onFileUpload(file)
  }

  return (
    <div>
      {uploadLoading ? (
        <div className="flex flex-col items-center justify-center p-6">
          <Progress value={progress} className="w-full max-w-md mb-4" />
          <p className="text-gray-600">Processing {fileName}...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-gray-100 p-6 rounded-full mb-4">
            <FileSpreadsheet className="w-10 h-10 text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Upload Attendance Sheet</h3>
          <p className="text-gray-600 max-w-md mb-4">
            Upload an Excel file containing attendance records to get started. The system supports .xlsx, .xls, .csv,
            and .xlsb files.
          </p>
          <input
            type="file"
            accept=".xlsx, .xls, .xlsb, .xlsm, .csv"
            onChange={handleFileChange}
            className="hidden"
            id="attendance-upload"
          />
          <Button onClick={() => document.getElementById("attendance-upload")?.click()}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Attendance Sheet
          </Button>
        </div>
      )}
    </div>
  )
}


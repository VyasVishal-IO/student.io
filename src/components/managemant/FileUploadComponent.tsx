'use client';

import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Upload } from 'lucide-react';

type FileUploadComponentProps = {
  onFileProcessed: (data: { [key: string]: boolean }) => void;
};

export default function FileUploadComponent({ onFileProcessed }: FileUploadComponentProps) {
  const [file, setFile] = useState<File | null>(null);
  const [processingFile, setProcessingFile] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const processAttendanceFile = async () => {
    if (!file) return;

    setProcessingFile(true);

    try {
      const geminiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
      if (!geminiKey) {
        alert('Gemini API key not configured. Please configure it in your environment variables.');
        return;
      }

      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.0-pro' }); // Updated model name

      const text = await file.text();
      const prompt = `
        Parse the following attendance data from this file and convert it to a JSON format with student IDs and present/absent status. 
        The data should be structured as {studentId: boolean} where true means present and false means absent.
        Here's the data:
        ${text}
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const parsedText = response.text();

      const jsonMatch = parsedText.match(/```json\n([\s\S]*?)\n```/) || 
                       parsedText.match(/```\n([\s\S]*?)\n```/) ||
                       parsedText.match(/{[\s\S]*?}/);

      if (jsonMatch) {
        const jsonString = jsonMatch[0].replace(/```json\n|```\n|```/g, '');
        const parsedData = JSON.parse(jsonString);
        onFileProcessed(parsedData);
      } else {
        throw new Error('Could not parse JSON from response');
      }
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Failed to process the file. Please try again.');
    } finally {
      setProcessingFile(false);
    }
  };

  return (
    <div className="p-4 mb-4 bg-gray-50 border border-gray-200 rounded-md">
      <h3 className="mb-3 text-lg font-medium">Import Attendance</h3>
      <p className="mb-3 text-sm text-gray-600">
        Upload a CSV or Excel file with attendance data to automatically mark attendance.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="file"
          accept=".csv,.xlsx,.xls,.doc,.docx"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <button
          onClick={processAttendanceFile}
          disabled={!file || processingFile}
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center"
        >
          {processingFile ? (
            <>
              <span className="w-4 h-4 mr-2 border-t-2 border-b-2 border-white rounded-full animate-spin"></span>
              Processing...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Process File
            </>
          )}
        </button>
      </div>
    </div>
  );
}
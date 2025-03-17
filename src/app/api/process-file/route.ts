// app/api/process-file/route.js
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import formidable from 'formidable';
import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';

export async function POST(req) {
  try {
    // Since Next.js API routes with app directory don't support formidable directly
    // We need to handle file upload manually by reading the request stream
    const formData = await req.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Get file data
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Convert to base64 for Gemini API
    const base64Content = buffer.toString('base64');

    // Initialize Gemini API
    try {
      const genAI = new GoogleGenerativeAI('YOUR_GEMINI_API_KEY'); // Replace with your actual key
      const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

      // Prepare the content parts
      const promptText = `Extract all tabular data from this file and convert it to JSON format. 
      If the file contains tables or spreadsheet data, identify all rows and columns.
      Return only a valid JSON array of objects where each object represents a row and keys are column headers.
      Do not include any explanatory text, just the JSON data.`;

      const contentParts = [
        {
          text: promptText
        },
        {
          inlineData: {
            mimeType: file.type || 'application/octet-stream',
            data: base64Content
          }
        }
      ];

      // Generate content with Gemini
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: contentParts }],
      });
      
      const response = result.response;
      const responseText = response.text();
      
      // Try to parse the response as JSON
      let jsonData;
      try {
        // Extract JSON from the response (in case Gemini added explanatory text)
        const jsonMatch = responseText.match(/\[.*\]/s);
        const jsonString = jsonMatch ? jsonMatch[0] : responseText;
        jsonData = JSON.parse(jsonString);
      } catch (parseError) {
        console.error('Error parsing JSON from Gemini response:', parseError);
        console.log('Raw response:', responseText);
        
        // Fallback - create a simple table with the raw text
        jsonData = [{ column1: 'Raw Text', column2: responseText.substring(0, 1000) }];
      }

      return NextResponse.json({ data: jsonData });
    } catch (aiError) {
      console.error('Gemini API error:', aiError);
      return NextResponse.json(
        { error: 'AI processing failed', details: aiError.message }, 
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('General error processing file:', error);
    return NextResponse.json(
      { error: 'Failed to process file', details: error.message }, 
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { processManuscript } from '@/lib/document-processor';
import { FormatOptions } from '@/types';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const formatOptionsJson = formData.get('formatOptions') as string;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file was uploaded. Please select a file and try again.' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.name.endsWith('.docx')) {
      const fileExtension = file.name.split('.').pop()?.toUpperCase() || 'unknown';
      return NextResponse.json(
        {
          success: false,
          error: `Only Microsoft Word (.docx) files are supported. You uploaded a .${fileExtension} file. Please convert your document to .docx format and try again.`
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      return NextResponse.json(
        {
          success: false,
          error: `File size exceeds the 10MB limit. Your file is ${fileSizeMB} MB. Please compress your document or remove images to reduce the file size.`
        },
        { status: 400 }
      );
    }

    // Parse format options
    let formatOptions: Partial<FormatOptions> | undefined;
    if (formatOptionsJson) {
      try {
        formatOptions = JSON.parse(formatOptionsJson);
      } catch (error) {
        console.error('Error parsing format options:', error);
        // Continue with default options if parsing fails
      }
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Process the manuscript with format options
    const result = await processManuscript(buffer, file.name, formatOptions);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    // Return the processed file as a blob
    return new NextResponse(new Uint8Array(result.buffer || []), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${result.fileName}"`,
      },
    });

  } catch (error) {
    console.error('Upload error:', error);

    // Provide more helpful error messages
    let errorMessage = 'An unexpected error occurred while processing your file. Please try again.';

    if (error instanceof Error) {
      // Check for specific error types
      if (error.message.includes('Invalid or corrupted')) {
        errorMessage = 'The uploaded file appears to be corrupted or invalid. Please check your file and try again.';
      } else if (error.message.includes('ENOENT') || error.message.includes('not found')) {
        errorMessage = 'File processing failed. The file may have been corrupted during upload. Please try again.';
      } else if (error.message.includes('memory') || error.message.includes('ENOMEM')) {
        errorMessage = 'Your file is too complex to process. Please try a simpler document or contact support.';
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage
      },
      { status: 500 }
    );
  }
}

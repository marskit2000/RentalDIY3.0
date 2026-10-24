# Rental Agreement Generator

A modern web application for generating customized rental agreements in multiple languages. This tool helps landlords and property managers create professional, legally-formatted rental documents with ease.

## Features

- **PDF Generation**: Create downloadable rental agreements with custom fields
- **Multilingual Support**: Available in English, Simplified Chinese, and Traditional Chinese
- **Form Validation**: Ensures all required information is properly entered
- **Preview Functionality**: View generated PDFs before downloading
- **Automatic Form Reset**: Clears form data after successful PDF generation
- **Persistent Storage**: Saves form data in browser storage to prevent data loss
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone [your-repository-url]
   cd my-react-app
   ```

2. Install dependencies
   ```
   npm install
   # or
   yarn
   ```

3. Start the development server
   ```
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Fill in all required fields in the form, including:
   - Landlord and tenant information
   - Property details
   - Rental terms and conditions
   - Payment information

2. Use the **Preview** button to view the generated agreement before finalizing

3. Click the **Generate PDF** button to create and download the rental agreement

4. Use the **Reset** button to clear all form fields when starting a new agreement

## Technical Details

### Built With

- [React](https://reactjs.org/) - Frontend framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Vite](https://vitejs.dev/) - Build tool and development server
- [pdf-lib](https://pdf-lib.js.org/) - PDF generation and manipulation

### Project Structure

- `src/components/` - React components including the PDF generation section
- `src/components/ui/` - Reusable UI components like the confirmation modal
- `src/utils/` - Utility functions including PDF generation logic
- `src/context/` - React context for application state management
- `public/` - Static assets and template files

## Key Components

### PDF Generation

The application uses the pdf-lib library to generate custom rental agreements. The main functionality is split across several files:

- `pdfGenerator.ts` - Core PDF generation logic
- `pdfHelpers.ts` - Utility functions for PDF manipulation
- `PdfGenerateSection.tsx` - User interface for the PDF generation form

### Form Management

- Form data is stored in the browser's localStorage to prevent data loss
- Input changes are debounced for better performance
- A confirmation modal prevents accidental form resets

## Customization

You can customize the PDF templates by replacing the template files in the public directory. The application supports various field types and formatting options.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgments

- Thanks to all contributors who have helped shape this project
- Special thanks to the developers of the libraries used in this project

import React from "react";

const TestPDFPreview = () => {
    // PDF URL to test
    const testURL = "https://res.cloudinary.com/dkxiebggm/raw/upload/v1728912760/pdfs/Internship%20Report%20On%20Machine%20Learning%20Course%20Completion.pdf";

    return (
        <div>
            <h2>Test PDF Preview</h2>
            <object
                data={testURL}
                type="application/pdf"
                width="600"
                height="400"
            >
                <p>Your browser does not support PDFs. <a href={testURL}>Download the PDF</a>.</p>
            </object>
        </div>
    );
};

export default TestPDFPreview;

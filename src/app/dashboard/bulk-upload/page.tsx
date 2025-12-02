"use client";

import { BulkUploadForm } from "@/components/bulk-upload-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function BulkUploadPage() {
    return (
        <div className="container py-10">
            <h1 className="text-3xl font-bold font-headline mb-8">Bulk Upload Listings</h1>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Upload CSV</CardTitle>
                        <CardDescription>
                            Upload a CSV file to create multiple listings at once. New categories will be created automatically.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <BulkUploadForm />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Instructions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm text-muted-foreground">
                        <p>
                            1. Download the template CSV file.
                        </p>
                        <p>
                            2. Fill in the details for your products.
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li><strong>Name:</strong> The title of your listing.</li>
                                <li><strong>Description:</strong> A detailed description of the item.</li>
                                <li><strong>Price:</strong> The price in dollars (e.g., 100.00).</li>
                                <li><strong>Category:</strong> The category name. If it doesn't exist, it will be created.</li>
                                <li><strong>Image URLs:</strong> Semicolon-separated list of image URLs (e.g., url1;url2).</li>
                                <li><strong>Image Hint:</strong> A short description for the image alt text.</li>
                                <li><strong>Is Private:</strong> "true" or "false". Private listings are only visible via direct link.</li>
                            </ul>
                        </p>
                        <p>
                            3. Upload the completed CSV file above.
                        </p>
                        <p>
                            4. Review the preview table to ensure everything looks correct.
                        </p>
                        <p>
                            5. Click "Upload Products" to finish.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Upload, FileText, CheckCircle, AlertTriangle } from "lucide-react";
import { parseCSV, type ParsedProduct } from "@/lib/csv-parser";
import { bulkCreateProducts } from "@/services/product-service";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export function BulkUploadForm() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [file, setFile] = useState<File | null>(null);
    const [parsedProducts, setParsedProducts] = useState<ParsedProduct[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setUploadSuccess(false);

            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target?.result as string;
                const products = parseCSV(text);
                setParsedProducts(products);
            };
            reader.readAsText(selectedFile);
        }
    };

    const handleUpload = async () => {
        if (!user || parsedProducts.length === 0) return;

        setIsUploading(true);
        try {
            await bulkCreateProducts(parsedProducts, user.id);
            setUploadSuccess(true);
            toast({
                title: "Upload Successful",
                description: `${parsedProducts.length} products have been added.`,
            });
            setFile(null);
            setParsedProducts([]);
        } catch (error) {
            console.error("Upload failed:", error);
            toast({
                title: "Upload Failed",
                description: "There was an error uploading your products.",
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
        }
    };

    const downloadTemplate = () => {
        const headers = "name,description,price,category,imageUrls,imageHint,isPrivate,gradingCompany,grade,certNumber";
        const example = '"Example Card","A great card",100.00,"Sports Cards","https://example.com/image.jpg","card",false,"PSA","10","123456"';
        const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + example;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "picksy_bulk_upload_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="csv-upload">Upload CSV File</Label>
                <div className="flex gap-2">
                    <Input id="csv-upload" type="file" accept=".csv" onChange={handleFileChange} />
                    <Button variant="outline" onClick={downloadTemplate} title="Download Template">
                        <FileText className="w-4 h-4 mr-2" />
                        Template
                    </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                    Upload a CSV file with your product listings.
                </p>
            </div>

            {parsedProducts.length > 0 && (
                <div className="border rounded-md">
                    <div className="p-4 border-b bg-muted/50 flex justify-between items-center">
                        <h3 className="font-semibold">Preview ({parsedProducts.length} items)</h3>
                        <Button onClick={handleUpload} disabled={isUploading}>
                            {isUploading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload className="w-4 h-4 mr-2" />
                                    Upload Products
                                </>
                            )}
                        </Button>
                    </div>
                    <div className="max-h-[400px] overflow-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Images</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {parsedProducts.map((product, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{product.name}</TableCell>
                                        <TableCell>{product.category}</TableCell>
                                        <TableCell>${product.price.toFixed(2)}</TableCell>
                                        <TableCell>{product.imageUrls.length}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )}

            {uploadSuccess && (
                <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">Success</AlertTitle>
                    <AlertDescription className="text-green-700">
                        Your products have been successfully uploaded and added to your store.
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}

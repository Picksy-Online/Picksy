export interface ParsedProduct {
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrls: string[];
    imageHint: string;
    isPrivate?: boolean;
    gradingCompany?: 'PSA' | 'BGS' | 'CGC' | 'SGC' | 'Raw';
    grade?: string;
    certNumber?: string;
}

export function parseCSV(csvContent: string): ParsedProduct[] {
    const lines = csvContent.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const products: ParsedProduct[] = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Handle quoted values (simple implementation)
        const values: string[] = [];
        let currentValue = '';
        let insideQuotes = false;

        for (let j = 0; j < line.length; j++) {
            const char = line[j];
            if (char === '"') {
                insideQuotes = !insideQuotes;
            } else if (char === ',' && !insideQuotes) {
                values.push(currentValue.trim());
                currentValue = '';
            } else {
                currentValue += char;
            }
        }
        values.push(currentValue.trim());

        const product: any = {};
        headers.forEach((header, index) => {
            const value = values[index];
            if (value === undefined) return;

            switch (header) {
                case 'name':
                case 'description':
                case 'category':
                case 'imagehint':
                case 'grade':
                case 'certnumber':
                    product[header === 'imagehint' ? 'imageHint' : header === 'certnumber' ? 'certNumber' : header] = value.replace(/^"|"$/g, '');
                    break;
                case 'price':
                    product.price = parseFloat(value);
                    break;
                case 'imageurls':
                    product.imageUrls = value.split(';').map(url => url.trim().replace(/^"|"$/g, ''));
                    break;
                case 'isprivate':
                    product.isPrivate = value.toLowerCase() === 'true';
                    break;
                case 'gradingcompany':
                    product.gradingCompany = value.replace(/^"|"$/g, '');
                    break;
            }
        });

        if (product.name && product.price) {
            products.push(product);
        }
    }

    return products;
}

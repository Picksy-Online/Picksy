
"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useEffect, useState } from "react";
import Image from "next/image";
import { moderateProductAction, type ModerationState } from "@/lib/actions";
import { products } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle, XCircle, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const initialState: ModerationState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Moderating...
        </>
      ) : (
        "Moderate Content"
      )}
    </Button>
  );
}

function ResultDisplay({ result }: { result: ModerationState["result"] }) {
  if (!result) return null;

  const getComplianceVariant = () => {
    if (result.isCompliant) return "default";
    if (result.isFakeOrMalicious) return "destructive";
    if (result.policyViolations.length > 0) return "destructive";
    return "default";
  };
  
  const getComplianceIcon = () => {
    if (result.isCompliant) return <CheckCircle className="text-green-500" />;
    if (result.isFakeOrMalicious) return <XCircle className="text-red-500" />;
    if (result.policyViolations.length > 0) return <AlertTriangle className="text-yellow-500" />;
    return <CheckCircle />;
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Moderation Result {getComplianceIcon()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Compliance Status</Label>
          <Badge variant={getComplianceVariant()}>
            {result.isCompliant ? "Compliant" : "Not Compliant"}
          </Badge>
        </div>
        <div>
          <Label>Suspected Fake or Malicious</Label>
          <p>{result.isFakeOrMalicious ? "Yes" : "No"}</p>
        </div>
        <div>
          <Label>Confidence Score</Label>
          <div className="flex items-center gap-2">
            <Progress value={result.confidenceScore * 100} className="w-full" />
            <span>{(result.confidenceScore * 100).toFixed(0)}%</span>
          </div>
        </div>
        {result.policyViolations.length > 0 && (
          <div>
            <Label>Policy Violations</Label>
            <ul className="pl-5 list-disc">
              {result.policyViolations.map((violation, index) => (
                <li key={index}>{violation}</li>
              ))}
            </ul>
          </div>
        )}
        <div>
          <Label>Explanation</Label>
          <p className="p-3 text-sm rounded-md bg-secondary">{result.explanation}</p>
        </div>
      </CardContent>
    </Card>
  );
}

async function urlToBase64(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function ModerationForm() {
  const [state, formAction] = useActionState(moderateProductAction, initialState);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [productImageUri, setProductImageUri] = useState<string>("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const product = products.find((p) => p.id === selectedProductId);
    if (product) {
      setName(product.name);
      setDescription(product.description);
      urlToBase64(product.imageUrl).then(setProductImageUri).catch(console.error);
    } else {
      setName("");
      setDescription("");
      setProductImageUri("");
    }
  }, [selectedProductId]);

  return (
    <form action={formAction}>
      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>
            Select a product to pre-fill the form or enter details manually.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product-select">Select a Product</Label>
            <Select onValueChange={setSelectedProductId}>
              <SelectTrigger id="product-select">
                <SelectValue placeholder="Choose a product to moderate..." />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="productName">Product Name</Label>
            <Input
              id="productName"
              name="productName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Vintage Leather Jacket"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="productDescription">Product Description</Label>
            <Textarea
              id="productDescription"
              name="productDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the product..."
            />
          </div>
          
          <input type="hidden" name="productImageUri" value={productImageUri} />
          
          {selectedProductId && productImageUri && (
            <div className="space-y-2">
              <Label>Product Image</Label>
              <Image src={productImageUri} alt="Selected product" width={150} height={150} className="rounded-md" />
            </div>
          )}

        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </Card>
      
      {state.error && (
        <Alert variant="destructive" className="mt-4">
          <AlertTriangle className="w-4 h-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {state.result && <ResultDisplay result={state.result} />}
    </form>
  );
}

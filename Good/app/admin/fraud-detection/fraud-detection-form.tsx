'use client';

import { useForm, useFormState } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { detectFraud, DetectFraudOutput } from '@/ai/flows/detect-fraud';
import { useActionState, useState } from 'react';
import { Loader2, ShieldCheck, AlertTriangle } from 'lucide-react';

const formSchema = z.object({
  transactionDetails: z.string().min(10, 'Please provide more details about the transaction.'),
});

type FormValues = z.infer<typeof formSchema>;

export function FraudDetectionForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DetectFraudOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transactionDetails: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const response = await detectFraud({ details: values.transactionDetails });
      setResult(response);
    } catch (err) {
      setError('An error occurred while analyzing the transaction.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Powered Fraud Detection</CardTitle>
        <CardDescription>
          Paste transaction details, user messages, or any suspicious text to analyze it for potential fraud.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="transactionDetails">Transaction Details</Label>
            <Textarea
              id="transactionDetails"
              {...form.register('transactionDetails')}
              rows={8}
              placeholder="e.g., 'User offered to pay outside the platform via a wire transfer...'"
            />
            {form.formState.errors.transactionDetails && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.transactionDetails.message}</p>
            )}
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Analyze for Fraud'}
          </Button>
        </form>

        {result && (
          <div className="mt-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    Analysis Result
                    {result.isFraudulent ? <AlertTriangle className="text-destructive" /> : <ShieldCheck className="text-green-500" />}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div>
                  <Label>Fraudulent</Label>
                  <p className={result.isFraudulent ? 'text-destructive font-bold' : 'text-green-500 font-bold'}>
                    {result.isFraudulent ? 'Yes' : 'No'}
                  </p>
                </div>
                 <div>
                  <Label>Risk Score</Label>
                  <p>{(result.riskScore * 100).toFixed(0)} / 100</p>
                </div>
                 <div>
                  <Label>Reason</Label>
                  <p className="p-3 bg-secondary rounded-md text-sm">{result.reason}</p>
                </div>
                 {result.recommendedAction && (
                    <div>
                        <Label>Recommended Action</Label>
                        <p className="font-semibold">{result.recommendedAction}</p>
                    </div>
                )}
            </CardContent>
          </div>
        )}
         {error && (
            <div className="mt-6 text-center text-destructive">
                <p>{error}</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}

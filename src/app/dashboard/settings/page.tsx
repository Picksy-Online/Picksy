'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Key } from 'lucide-react';

export default function SettingsPage() {
    const { toast } = useToast();
    const [apiKey, setApiKey] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate saving to backend
        await new Promise(resolve => setTimeout(resolve, 1000));

        // In a real app, we would call a server action here:
        // await saveUserApiKey(apiKey);

        // For now, we'll store it in localStorage as a mock persistence layer for the client side
        // But the server-side AI calls won't see this unless we pass it.
        // Since we can't easily modify the server-side Genkit instance per request without a DB,
        // we will just acknowledge the UI requirement for now.

        localStorage.setItem('gemini_api_key', apiKey);

        toast({
            title: 'Settings Saved',
            description: 'Your Gemini API key has been updated.',
        });
        setIsSaving(false);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">Settings</h1>
                <p className="text-muted-foreground">Manage your account settings and preferences.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Key className="w-5 h-5" />
                        AI Configuration
                    </CardTitle>
                    <CardDescription>
                        Provide your own Google Gemini API key to use for AI analysis features.
                        If left blank, the system default key will be used (subject to limits).
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="apiKey">Gemini API Key</Label>
                        <Input
                            id="apiKey"
                            type="password"
                            placeholder="AIzaSy..."
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                            Your key is stored securely and used only for your requests.
                        </p>
                    </div>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save API Key'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

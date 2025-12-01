
'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import { Logo } from '@/components/logo';
import { categories } from '@/lib/data';

const MAX_FEATURED_COLLECTIONS = 5;

export default function SiteContentPage() {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPreview, setHeroPreview] = useState<string | null>(
    'https://picsum.photos/seed/hero-background/1600/900'
  );
  const heroInputRef = useRef<HTMLInputElement>(null);

  const [selectedCollections, setSelectedCollections] = useState<string[]>(
    categories.slice(0, 4).map(c => c.id)
  );

  const [backgroundColor, setBackgroundColor] = useState('#f0f4ff'); // Default light background

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCollectionChange = (categoryId: string) => {
    setSelectedCollections(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else if (prev.length < MAX_FEATURED_COLLECTIONS) {
        return [...prev, categoryId];
      }
      return prev;
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Site Content Management</h1>
        <p className="text-muted-foreground">
          Update the main logo, homepage images, featured content, and advertisements.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Theme Management</CardTitle>
          <CardDescription>
            Customize the color scheme of your site. The theme uses HSL values.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-6">
            <div className="space-y-2">
              <Label htmlFor="bg-color">Background Color</Label>
              <Input
                id="bg-color"
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-24 p-1"
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="primary-color">Primary Color (soon)</Label>
              <Input
                id="primary-color"
                type="color"
                value="#5c5f96"
                disabled
                className="w-24 p-1"
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="accent-color">Accent Color (soon)</Label>
              <Input
                id="accent-color"
                type="color"
                value="#6d5aa9"
                disabled
                className="w-24 p-1"
              />
            </div>
          </div>
           <div style={{ '--preview-bg': backgroundColor } as React.CSSProperties} className="p-4 mt-2 rounded-md bg-[var(--preview-bg)] border">
            <p className="font-bold" style={{color: '#172554'}}>This is a preview of your background color.</p>
          </div>
          <Button disabled>Save Theme</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Logo Management</CardTitle>
          <CardDescription>
            Update the main logo that appears in the site header.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Current Logo</Label>
            <div className="p-4 mt-2 rounded-md bg-muted w-fit">
              {logoPreview ? (
                <Image src={logoPreview} alt="Logo Preview" width={115} height={24} />
              ) : (
                <Logo className="w-auto h-7" />
              )}
            </div>
          </div>
          <input
            type="file"
            ref={logoInputRef}
            className="hidden"
            accept="image/svg+xml, image/png"
            onChange={(e) => handleFileChange(e, setLogoFile, setLogoPreview)}
          />
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => logoInputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" />
              Upload New Logo
            </Button>
            <Button disabled={!logoFile}>Save Logo</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Homepage Hero Image</CardTitle>
          <CardDescription>
            Change the main background image on the homepage.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Current Hero Image</Label>
            <div className="relative mt-2 overflow-hidden rounded-md aspect-video max-w-lg">
              {heroPreview && (
                <Image src={heroPreview} alt="Hero Preview" fill className="object-cover" />
              )}
            </div>
          </div>
          <input
            type="file"
            ref={heroInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => handleFileChange(e, setHeroFile, setHeroPreview)}
          />
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => heroInputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" />
              Upload New Image
            </Button>
            <Button disabled={!heroFile}>Save Image</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Featured Collections Management</CardTitle>
          <CardDescription>
            Select up to {MAX_FEATURED_COLLECTIONS} collections to display on the homepage.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {categories.map(category => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`collection-${category.id}`}
                  checked={selectedCollections.includes(category.id)}
                  onCheckedChange={() => handleCollectionChange(category.id)}
                  disabled={
                    selectedCollections.length >= MAX_FEATURED_COLLECTIONS &&
                    !selectedCollections.includes(category.id)
                  }
                />
                <label
                  htmlFor={`collection-${category.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {category.name}
                </label>
              </div>
            ))}
          </div>
          <Button>Save Collections</Button>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>Promotional Banners</CardTitle>
          <CardDescription>
            Create and manage sitewide promotional banners. This is a placeholder for a future feature.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">Promotion management system coming soon.</p>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle>Advertisement Placement</CardTitle>
          <CardDescription>
            Select areas on the site to place advertisements. This is a placeholder for a future feature.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">Ad placement system coming soon.</p>
        </CardContent>
      </Card>

    </div>
  );
}

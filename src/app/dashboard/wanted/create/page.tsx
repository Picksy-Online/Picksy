"use client";

import { WantedForm } from "@/components/wanted-form";

export default function CreateWantedItemPage() {
    return (
        <div className="container max-w-2xl py-12">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold font-headline">Post a Wanted Item</h1>
                <p className="text-muted-foreground mt-2">
                    Let the community know what you're looking for.
                </p>
            </div>
            <WantedForm />
        </div>
    );
}

import Link from "next/link";
import Image from "next/image";
import { WantedItem } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface WantedCardProps {
    item: WantedItem;
}

export function WantedCard({ item }: WantedCardProps) {
    return (
        <Card className="overflow-hidden h-full flex flex-col group relative border-dashed border-2">
            <div className="absolute top-2 right-2 z-10">
                <Badge variant="destructive" className="uppercase tracking-wider font-bold">Wanted</Badge>
            </div>

            <div className="aspect-square relative bg-muted flex items-center justify-center overflow-hidden">
                {item.imageUrl ? (
                    <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                    />
                ) : (
                    <div className="text-muted-foreground text-center p-4">
                        <span className="block text-4xl mb-2">?</span>
                        No Image
                    </div>
                )}
            </div>

            <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm text-muted-foreground mb-1">{item.category}</p>
                        <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:underline">
                            {item.title}
                        </h3>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-4 pt-0 flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {item.description}
                </p>
                <div className="font-bold text-lg">
                    Target: ${item.targetPrice.toLocaleString()}
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0">
                <Button className="w-full" variant="secondary" asChild>
                    <Link href={`/messages?recipient=${item.creatorId}`}>
                        <MessageCircle className="w-4 h-4 mr-2" />
                        I have this!
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductReviews() {
    return (
        <div className="mt-16">
            <h2 className="text-2xl font-bold font-headline mb-8">Customer Reviews</h2>

            <div className="grid md:grid-cols-12 gap-8">
                <div className="md:col-span-4 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="text-5xl font-bold">4.8</div>
                        <div className="space-y-1">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-5 h-5 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'}`} />
                                ))}
                            </div>
                            <p className="text-sm text-muted-foreground">Based on 12 reviews</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                            <div key={rating} className="flex items-center gap-2 text-sm">
                                <span className="w-3">{rating}</span>
                                <Star className="w-3 h-3 text-muted-foreground" />
                                <Progress value={rating === 5 ? 70 : rating === 4 ? 20 : 5} className="h-2" />
                                <span className="w-8 text-right text-muted-foreground">{rating === 5 ? '70%' : rating === 4 ? '20%' : '5%'}</span>
                            </div>
                        ))}
                    </div>

                    <Button variant="outline" className="w-full">Write a Review</Button>
                </div>

                <div className="md:col-span-8 space-y-8">
                    {[1, 2].map((review) => (
                        <div key={review} className="border-b pb-8 last:border-0">
                            <div className="flex items-center gap-4 mb-4">
                                <Avatar>
                                    <AvatarFallback>JD</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h4 className="font-semibold">Jane Doe</h4>
                                    <div className="flex items-center gap-2">
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                            ))}
                                        </div>
                                        <span className="text-xs text-muted-foreground">2 weeks ago</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-muted-foreground">
                                Absolutely love this item! The quality is even better than expected and shipping was super fast. Highly recommend this seller.
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

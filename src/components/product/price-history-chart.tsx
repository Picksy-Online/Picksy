'use client';

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface PriceHistoryChartProps {
    currentPrice: number;
}

export function PriceHistoryChart({ currentPrice }: PriceHistoryChartProps) {
    // Generate mock data based on current price
    const data = [
        { date: '6 Months Ago', price: currentPrice * 0.85 },
        { date: '5 Months Ago', price: currentPrice * 0.92 },
        { date: '4 Months Ago', price: currentPrice * 0.88 },
        { date: '3 Months Ago', price: currentPrice * 0.95 },
        { date: '2 Months Ago', price: currentPrice * 1.05 },
        { date: 'Last Month', price: currentPrice * 0.98 },
        { date: 'Today', price: currentPrice },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Price History</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey="date"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `$${value}`}
                            />
                            <Tooltip
                                formatter={(value: number) => [formatCurrency(value), 'Price']}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="price"
                                stroke="hsl(var(--primary))"
                                strokeWidth={2}
                                dot={{ r: 4, fill: "hsl(var(--primary))" }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

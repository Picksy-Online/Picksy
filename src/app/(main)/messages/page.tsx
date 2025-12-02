
'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Send, Bot } from 'lucide-react';
import { users } from '@/lib/data';

const conversations = [
    {
        id: 'convo_1',
        withUser: users.find(u => u.id === 'user_1'),
        messages: [
            { from: 'them', text: 'Hi there! Just wanted to let you know I saw you were looking for a Holographic Charizard card. I have one I might be willing to part with. Are you interested?', timestamp: '10:30 AM' },
            { from: 'me', text: 'Wow, really? That\'s great! What condition is it in?', timestamp: '10:31 AM' },
        ]
    },
    {
        id: 'convo_bot',
        withUser: { id: 'bot', name: 'Picksy Bot', storeName: 'System Notifications', avatarUrl: '' },
        messages: [
            { from: 'them', text: 'Great news! A "Michael Jordan Rookie Card" you were watching has just been listed. Check it out now before it\'s gone!', timestamp: 'Yesterday' }
        ]
    }
];


export default function MessagesPage() {
    const [selectedConvo, setSelectedConvo] = useState(conversations[0]);
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            // In a real app, you'd send this message to your backend.
            console.log("Sending message:", newMessage);
            setNewMessage('');
        }
    }

    return (
        <div className="container py-12">
            <h1 className="text-3xl font-bold font-headline mb-8">Your Messages</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 h-[70vh]">
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>Conversations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3 overflow-y-auto max-h-[60vh] pr-2">
                            {conversations.map(convo => (
                                <li key={convo.id} onClick={() => setSelectedConvo(convo)}>
                                    <Card className={cn("cursor-pointer hover:bg-muted transition-colors", selectedConvo.id === convo.id && 'bg-muted border-primary')}>
                                        <CardContent className="p-3 flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={convo.withUser?.avatarUrl} />
                                                <AvatarFallback>
                                                    {convo.withUser?.id === 'bot' ? <Bot /> : (convo.withUser?.name?.charAt(0) || 'U')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="overflow-hidden">
                                                <p className="font-semibold truncate">{convo.withUser?.name || 'Unknown'}</p>
                                                <p className="text-sm text-muted-foreground truncate">{convo.messages.at(-1)?.text}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card className="md:col-span-3 flex flex-col">
                    <CardHeader className="border-b">
                        <CardTitle>
                            {selectedConvo.withUser ? `Chat with ${selectedConvo.withUser.name || 'Unknown'}` : 'Select a conversation'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow p-6 space-y-4 overflow-y-auto">
                        {selectedConvo.messages.map((msg, index) => (
                            <div key={index} className={cn("flex items-end gap-2", msg.from === 'me' ? 'justify-end' : 'justify-start')}>
                                {msg.from === 'them' && (
                                    <Avatar className="w-8 h-8">
                                        <AvatarImage src={selectedConvo.withUser?.avatarUrl} />
                                        <AvatarFallback>
                                            {selectedConvo.withUser?.id === 'bot' ? <Bot /> : (selectedConvo.withUser?.name?.charAt(0) || 'U')}
                                        </AvatarFallback>
                                    </Avatar>
                                )}
                                <div className={cn("max-w-[75%] p-3 rounded-lg break-words whitespace-pre-wrap", msg.from === 'me' ? 'bg-primary text-primary-foreground' : 'bg-secondary')}>
                                    <p>{msg.text}</p>
                                    <p className="text-xs mt-1 opacity-70">{msg.timestamp}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                    <div className="p-4 border-t">
                        <div className="flex items-center gap-2">
                            <Textarea
                                placeholder="Type your message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                rows={1}
                                className="resize-none"
                            />
                            <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                                <Send className="w-4 h-4" />
                                <span className="sr-only">Send</span>
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}


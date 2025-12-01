
import { config } from 'dotenv';
config();

import '@/ai/flows/ai-content-moderation.ts';
import '@/ai/flows/ai-powered-product-recommendations.ts';
import '@/ai/flows/cross-platform-posting.ts';
import '@/ai/flows/handle-offer.ts';
import '@/ai/flows/find-wanted-item.ts'
import '@/ai/flows/proactive-item-finder.ts';
import '@/ai/flows/visual-search.ts';
import '@/ai/flows/check-card-condition.ts';
import '@/ai/flows/suggest-price.ts';
import '@/ai/flows/generate-description.ts';
import '@/ai/flows/detect-fraud.ts';
import '@/ai/flows/leave-review.ts';
import '@/ai/flows/search-ebay-sold.ts';
import '@/ai/flows/notify-seller-of-removal.ts';

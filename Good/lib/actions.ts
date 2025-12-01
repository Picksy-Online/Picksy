
"use server";

import { z } from "zod";
import {
  moderateContent,
  type ModerateContentOutput,
} from "@/ai/flows/ai-content-moderation";
import { notifySellerOfRemoval } from "@/ai/flows/notify-seller-of-removal";

const ModerationSchema = z.object({
  productName: z.string().min(1, { message: "Product name is required." }),
  productDescription: z
    .string()
    .min(1, { message: "Product description is required." }),
  productImageUri: z
    .string()
    .min(1, { message: "Product image is required." }),
});

export type ModerationState = {
  result?: ModerateContentOutput;
  error?: string;
  fields?: {
    productName?: string;
    productDescription?: string;
    productImageUri?: string;
  };
  message?: string;
};

export async function moderateProductAction(
  prevState: ModerationState,
  formData: FormData
): Promise<ModerationState> {
  const validatedFields = ModerationSchema.safeParse({
    productName: formData.get("productName"),
    productDescription: formData.get("productDescription"),
    productImageUri: formData.get("productImageUri"),
  });

  if (!validatedFields.success) {
    return {
      error: "Invalid fields.",
      fields: {
        productName: validatedFields.error.flatten().fieldErrors.productName?.join(", "),
        productDescription: validatedFields.error.flatten().fieldErrors.productDescription?.join(", "),
        productImageUri: validatedFields.error.flatten().fieldErrors.productImageUri?.join(", "),
      },
    };
  }

  try {
    const result = await moderateContent(validatedFields.data);
    return {
      result,
      message: "Content moderated successfully.",
    };
  } catch (e) {
    return {
      error: "Failed to moderate content. Please try again.",
    };
  }
}


const DeleteProductSchema = z.object({
  productId: z.string(),
  sellerEmail: z.string(),
  sellerName: z.string(),
  productName: z.string(),
});

type DeleteProductState = {
  error?: string;
  message?: string;
};

export async function deleteProductAction(
  input: z.infer<typeof DeleteProductSchema>
): Promise<DeleteProductState> {
  const validatedFields = DeleteProductSchema.safeParse(input);

  if (!validatedFields.success) {
    return { error: "Invalid input for deleting product." };
  }

  try {
    // Step 1: Simulate deleting the product from the database
    console.log(`Simulating deletion of product ID: ${validatedFields.data.productId}`);
    
    // In a real app, you would have something like:
    // await db.collection('products').doc(validatedFields.data.productId).delete();

    // Step 2: Trigger the email notification flow
    await notifySellerOfRemoval({
      sellerEmail: validatedFields.data.sellerEmail,
      sellerName: validatedFields.data.sellerName,
      productName: validatedFields.data.productName,
    });

    return { message: "Product deleted and seller notified." };
  } catch (e) {
    console.error("Error in deleteProductAction:", e);
    return { error: "Failed to delete product or notify seller." };
  }
}

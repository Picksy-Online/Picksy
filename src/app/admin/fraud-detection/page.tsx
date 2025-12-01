
import { FraudDetectionForm } from "@/app/admin/fraud-detection/fraud-detection-form";

export default function FraudDetectionPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="sr-only">AI-Powered Fraud Detection</h1>
      <div className="mt-8">
        <FraudDetectionForm />
      </div>
    </div>
  );
}

    
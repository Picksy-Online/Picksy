
import { ModerationForm } from "./moderation-form";

export default function ModerationPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="sr-only">AI Content Moderation</h1>
      <div className="mt-8">
        <ModerationForm />
      </div>
    </div>
  );
}

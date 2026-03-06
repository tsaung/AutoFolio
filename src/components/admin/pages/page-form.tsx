"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { createPage } from "@/lib/actions/pages";

const initialState = {
  success: false,
  message: "",
  errors: {} as Record<string, string[]>,
};

function SubmitButton({ isEditing }: { isEditing?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isEditing ? "Save Settings" : "Create Page"}
    </Button>
  );
}

export function PageForm() {
  const [state, formAction] = useActionState(createPage, initialState);
  const router = useRouter();

  // If the server action returned success, immediately redirect
  useEffect(() => {
    if (state.success && state.page?._id) {
      router.push(`/admin/pages/${state.page._id}/edit`);
    }
  }, [state, router]);

  return (
    <Card>
      <form action={formAction}>
        <CardContent className="space-y-6 pt-6">
          {state.message && !state.success && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g. About Me"
              defaultValue=""
              required
            />
            {state.errors?.title && (
              <p className="text-sm text-destructive">
                {state.errors.title.join(", ")}
              </p>
            )}
            <p className="text-[0.8rem] text-muted-foreground">
              Internal name for the page.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              name="slug"
              placeholder="e.g. about"
              defaultValue=""
              required
            />
            {state.errors?.slug && (
              <p className="text-sm text-destructive">
                {state.errors.slug.join(", ")}
              </p>
            )}
            <p className="text-[0.8rem] text-muted-foreground">
              Route path for this page (e.g., &quot;about&quot; or &quot;services&quot;). Use &quot;home&quot; for the root index.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-2 border-t pt-6 bg-muted/20">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-8 px-6 py-16">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Personal food planning
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">
            Fridge2Recipe
          </h1>
          <p className="text-lg text-muted-foreground">
            Track fridge inventory, plan meals, and get recipe suggestions from
            what you already have at home.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Scaffold ready</CardTitle>
            <CardDescription>
              Next.js, Tailwind, shadcn/ui, Supabase clients, and shared service
              folders are in place. Feature work comes next.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Separator />
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>AGENTS.md — stack direction and commands</li>
              <li>CONTEXT.md — product glossary</li>
              <li>docs/architecture.md — MVP architecture</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

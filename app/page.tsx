import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/db/db";
import { pssnsTable } from "@/db/schema";
import { redirect } from "next/navigation";

export default function Home() {
  async function judgeDoubtfulSentence(formData: FormData) {
    "use server";

    const doubtfulSentence = formData.get("doubtful-sentence") as string;

    const response = await fetch("https://openrouter.ai/api/alpha/decisions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "perplexity/pplx-decider-flash-v1.3:free",
        state: doubtfulSentence,
        questions: {
          unreality: {
            type: "noul",
            instructions: "この内容は大学生にとって非現実的か？",
          },
        },
      }),
    });

    if (!response.ok) return;

    const result = await response.json();
    const score = result["answers"]["unreality"]["noul"] as number;

    const pssn: typeof pssnsTable.$inferInsert = {
      body: doubtfulSentence,
      score,
    };
    const pssnId = await db
      .insert(pssnsTable)
      .values(pssn)
      .returning({ id: pssnsTable.id });

    redirect(`/pssn/${pssnId[0].id}`);
  }

  return (
    <main className="w-full h-svh flex flex-col items-center justify-center">
      <form className="w-full max-w-md" action={judgeDoubtfulSentence}>
        <FieldSet>
          <FieldLegend>PSSN</FieldLegend>
          <FieldDescription>本物か判定します</FieldDescription>
          <Field>
            <FieldLabel htmlFor="doubtful-sentence">疑わしい文章</FieldLabel>
            <Textarea
              id="doubtful-sentence"
              name="doubtful-sentence"
              placeholder="ここに疑わしい文章を入力"
              required
            />
          </Field>
          <Field>
            <Button type="submit">判定する</Button>
          </Field>
        </FieldSet>
      </form>
    </main>
  );
}

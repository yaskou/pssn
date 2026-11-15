import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/db/db";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";

export const instant = false;

export default async function ScoreView({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  "use cache";
  cacheLife("hours");

  const { id } = await params;

  const pssn = await db.query.pssnsTable.findFirst({
    where: {
      id,
    },
  });

  if (!pssn) notFound();

  return (
    <main className="w-full h-svh flex flex-col items-center justify-center p-4">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-4xl">
            {Math.floor(100 * pssn.score)}%うそ
          </CardTitle>
        </CardHeader>
        <CardContent className="max-h-40 wrap-break-word overflow-y-scroll">
          <div className="w-full">{pssn.body}</div>
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Link
            href="/"
            className={buttonVariants({ variant: "default", size: "default" })}
          >
            ホームに戻る
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}

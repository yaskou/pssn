"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";

type SubmitButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "type" | "disabled"
>;

export function SubmitButton(props: SubmitButtonProps) {
  const status = useFormStatus();

  return (
    <Button type="submit" {...props} disabled={status.pending}>
      {status.pending ? <Spinner /> : props.children}
    </Button>
  );
}

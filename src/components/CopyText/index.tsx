"use client"

import Button from "@/components/Button";

export default function CopyText({ text }: { text: string }) {
  const copy = (e: any) => {
    navigator.clipboard.writeText(text);
    const bef =  e.target.innerText;
    e.target.innerText = 'Copied!';

    setTimeout(() => {
      e.target.innerText = bef;
    }, 2000);
  }

  return (
    <Button onClick={copy} type="button">
      Copy
    </Button>
  )
}
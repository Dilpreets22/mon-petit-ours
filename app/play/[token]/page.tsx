import { supabase, LoveLetter } from "@/lib/supabase";
import { PlayClient } from "./PlayClient";
import { notFound } from "next/navigation";

interface PlayPageProps {
  params: Promise<{ token: string }>;
}

export default async function PlayPage({ params }: PlayPageProps) {
  const { token } = await params;

  const { data, error } = await supabase
    .from("love_letters")
    .select("*")
    .eq("share_token", token)
    .single();

  if (error || !data) {
    console.error("Failed to fetch letter:", error);
    return notFound();
  }

  const letter = data as LoveLetter;

  return <PlayClient letter={letter} />;
}
